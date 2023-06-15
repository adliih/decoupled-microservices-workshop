import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";

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

    const lambdaFn = new lambda.Function(this, "Handler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: props.lambdaHandler,
    });

    props.rideCompletionTopic.addSubscription(
      new subscriptions.LambdaSubscription(lambdaFn)
    );
  }
}
