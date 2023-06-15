import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sns from "aws-cdk-lib/aws-sns";
import { RemovalPolicy } from "aws-cdk-lib";

export interface UnicornManagementServiceProps {}

export class UnicornManagementService extends Construct {
  public readonly rideCompletionTopic: sns.ITopic;

  constructor(scope: Construct, id: string, {}: UnicornManagementServiceProps) {
    super(scope, id);

    const rideTable = new dynamodb.Table(this, "Table", {
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
    });

    this.rideCompletionTopic = new sns.Topic(this, "Topic", {
      topicName: "RideCompletionTopic",
    });

    const submitRideCompletionLambdaFn = new lambda.Function(this, "Submit", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "submit-ride-completion.handler",
      environment: {
        TOPIC_ARN: this.rideCompletionTopic.topicArn,
        TABLE_NAME: rideTable.tableName,
      },
    });

    new apigateway.LambdaRestApi(this, "RideCompleteApi", {
      handler: submitRideCompletionLambdaFn,
    });

    this.rideCompletionTopic.grantPublish(submitRideCompletionLambdaFn);
    rideTable.grantReadWriteData(submitRideCompletionLambdaFn);
  }
}
