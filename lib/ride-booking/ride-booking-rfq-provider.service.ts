import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscription from "aws-cdk-lib/aws-sns-subscriptions";
import * as sqs from "aws-cdk-lib/aws-sqs";

export interface RideBookingRfqProviderServiceProps {
  fareMultiplier: number;
  instantRideRfqTopic: sns.ITopic;
  rfqResponseQueue: sqs.IQueue;
}

export class RideBookingRfqProviderService extends Construct {
  constructor(
    scope: Construct,
    id: string,
    props: RideBookingRfqProviderServiceProps
  ) {
    super(scope, id);

    const lambdaFn = new lambda.Function(this, "Handler", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda/ride-booking"),
      handler: "instant-ride-rfq-subscriber.handler",
      environment: {
        FARE_MULTIPLIER: String(props.fareMultiplier),
        QUEUE_URL: props.rfqResponseQueue.queueUrl,
        PROVIDER_ID: id,
      },
    });

    // granting required permissions
    props.instantRideRfqTopic.addSubscription(
      new subscription.LambdaSubscription(lambdaFn)
    );
    props.rfqResponseQueue.grantSendMessages(lambdaFn);
  }
}
