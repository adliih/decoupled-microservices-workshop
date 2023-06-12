import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export interface ExtraordinaryRideProps {}

export class ExtraordinaryRide extends Construct {
  public readonly lambdaFn: lambda.IFunction;

  constructor(scope: Construct, id: string, props: ExtraordinaryRideProps) {
    super(scope, id);

    this.lambdaFn = new lambda.Function(this, "ExtraordinaryRide", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "extraordinary-ride.handler",
    });
  }
}
