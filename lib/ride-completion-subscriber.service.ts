import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sns from "aws-cdk-lib/aws-sns";

export interface RideCompletionSubscribersProps {
  rideCompletionTopic: sns.ITopic;
  lambdaHandler: string;
}

export class RideCompletionSubscribers extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: RideCompletionSubscribersProps
  ) {
    super(scope, id);

    const lambdaFn = new lambda.Function(
      this,
      "RideCompletionSubscriberHandler",
      {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromAsset("lambda"),
        handler: props.lambdaHandler,
      }
    );

    const subscription = new sns.Subscription(
      this,
      "RideCompletionSubscription",
      {
        topic: props.rideCompletionTopic,
        protocol: sns.SubscriptionProtocol.LAMBDA,
        endpoint: lambdaFn.functionArn,
      }
    );
  }
}
