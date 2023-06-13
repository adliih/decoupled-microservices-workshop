import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as sns from "aws-cdk-lib/aws-sns";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export interface RideBookingServiceProps {}

export class RideBookingService extends Construct {
  public readonly instantRideRfqTopic;
  public readonly rfqResponseQueue;

  constructor(scope: Construct, id: string, props: RideBookingServiceProps) {
    super(scope, id);

    const ridesBookingTable = new dynamodb.Table(this, "Table", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      tableName: "RidesBookingTable",
    });

    const instantRideRfqTopic = new sns.Topic(this, "Topci", {});

    // submit ride booking rfq
    const submitInstantRideRfq = new lambda.Function(this, "SubmitRfq", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda/ride-booking"),
      handler: "submit-instant-ride-rfq.handler",
      environment: {
        TABLE_NAME: ridesBookingTable.tableName,
        TOPIC_ARN: instantRideRfqTopic.topicArn,
      },
    });
    new apigateway.LambdaRestApi(this, "SubmitRfqEndpoint", {
      handler: submitInstantRideRfq,
    });

    // query ride booking rfq
    const queryInstantRideRfq = new lambda.Function(this, "QueryRfq", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda/ride-booking"),
      handler: "query-instant-ride-rfq.handler",
      environment: {
        TABLE_NAME: ridesBookingTable.tableName,
      },
    });
    const api = new apigateway.RestApi(this, "QueryRfqEndpoint");

    const lambdaIntegration = new apigateway.LambdaIntegration(
      queryInstantRideRfq
    );

    // add path paramter mapping
    api.root.addResource("{id}").addMethod("GET", lambdaIntegration);

    const rfqResponseQueue = new sqs.Queue(this, "Queue", {});
    // lambda to process the rfq response queue
    const rfqResponseQueueHandler = new lambda.Function(this, "QueueHandler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda/ride-booking"),
      handler: "rfq-response-queue.handler",
      environment: {
        TABLE_NAME: ridesBookingTable.tableName,
      },
    });
    rfqResponseQueueHandler.addEventSource(
      new SqsEventSource(rfqResponseQueue)
    );

    // grant permissions
    ridesBookingTable.grantReadWriteData(submitInstantRideRfq);
    ridesBookingTable.grantReadData(queryInstantRideRfq);
    instantRideRfqTopic.grantPublish(submitInstantRideRfq);

    // expose resource to external
    this.instantRideRfqTopic = instantRideRfqTopic;
    this.rfqResponseQueue = rfqResponseQueue;
  }
}
