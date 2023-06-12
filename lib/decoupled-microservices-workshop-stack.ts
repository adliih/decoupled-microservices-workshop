import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { UnicornManagementService } from "./unicorn-management.service";
import { CustomerAccounting } from "./customer-accounting.service";
import { CustomerNotification } from "./customer-notification.service";
import { ExtraordinaryRide } from "./extraordinary-ride.service";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DecoupledMicroservicesWorkshopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'DecoupledMicroservicesWorkshopQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    new UnicornManagementService(this, "UnicornManagementService", {});
    new CustomerNotification(this, "CustomerNotification", {});
    new CustomerAccounting(this, "CustomerAccounting", {});
    new ExtraordinaryRide(this, "ExtraordinaryRide", {});
  }
}
