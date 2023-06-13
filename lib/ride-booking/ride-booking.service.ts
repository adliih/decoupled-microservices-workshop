import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";

export interface RideBookingServiceProps {}

export class RideBookingService extends Construct {
  public readonly instantRideRfqTopic;
  public readonly rfqResponseQueue;

  constructor(scope: Construct, id: string, props: RideBookingServiceProps) {
    super(scope, id);

    const ridesBookingTable = new dynamodb.Table(this, "RidesBookingTable", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const instantRideRfqTopic = new sns.Topic(this, "InstantRideRfqTopic", {});

    // submit ride booking rfq
    const submitInstantRideRfq = new lambda.Function(
      this,
      "SubmitInstantRideRfqHandler",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset("lambda/ride-booking"),
        handler: "submit-instant-ride-rfq.handler",
        environment: {
          TABLE_NAME: ridesBookingTable.tableName,
        },
      }
    );
    new apigateway.LambdaRestApi(this, "SubmitInstantRideRfqEndpoint", {
      handler: submitInstantRideRfq,
    });

    // query ride booking rfq
    const queryInstantRideRfq = new lambda.Function(
      this,
      "QueryInstantRideRfqHandler",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset("lambda/ride-booking"),
        handler: "query-instant-ride-rfq.handler",
        environment: {
          TABLE_NAME: ridesBookingTable.tableName,
        },
      }
    );
    new apigateway.LambdaRestApi(this, "QueryInstantRideRfqEndpoint", {
      handler: queryInstantRideRfq,
    });

    const rfqResponseQueue = new sqs.Queue(
      this,
      "InstantRideRfqResponseQueue",
      {}
    );
    // lambda to process the rfq response queue
    const rfqResponseQueueHandler = new lambda.Function(
      this,
      "InstantRideRfqResponseQueueHandler",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset("lambda/ride-booking"),
        handler: "rfq-response-queue.handler",
        environment: {
          TABLE_NAME: ridesBookingTable.tableName,
        },
      }
    );

    // grant permissions
    ridesBookingTable.grantReadWriteData(submitInstantRideRfq);
    ridesBookingTable.grantReadData(queryInstantRideRfq);
    instantRideRfqTopic.grantPublish(submitInstantRideRfq);
    rfqResponseQueue.grantConsumeMessages(rfqResponseQueueHandler);

    // expose resource to external
    this.instantRideRfqTopic = instantRideRfqTopic;
    this.rfqResponseQueue = rfqResponseQueue;
  }
}