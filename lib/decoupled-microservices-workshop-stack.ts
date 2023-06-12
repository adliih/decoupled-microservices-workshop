import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { UnicornManagementService } from "./unicorn-management.service";
import { RideCompletionSubscribers } from "./ride-completion-subscriber.service";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DecoupledMicroservicesWorkshopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'DecoupledMicroservicesWorkshopQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const unicornManagementService = new UnicornManagementService(
      this,
      "UnicornManagementService",
      {}
    );
    new RideCompletionSubscribers(this, "CustomerNotification", {
      lambdaHandler: "customer-notification.index",
      rideCompletionTopic: unicornManagementService.rideCompletionTopic,
    });

    new RideCompletionSubscribers(this, "CustomerAccounting", {
      lambdaHandler: "customer-notification.index",
      rideCompletionTopic: unicornManagementService.rideCompletionTopic,
    });

    new RideCompletionSubscribers(this, "ExtraordinaryRide", {
      lambdaHandler: "customer-notification.index",
      rideCompletionTopic: unicornManagementService.rideCompletionTopic,
    });
  }
}
