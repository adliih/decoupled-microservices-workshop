import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export interface CustomerAccountingProps {}

export class CustomerAccounting extends Construct {
  public readonly lambdaFn: lambda.IFunction;

  constructor(scope: Construct, id: string, props: CustomerAccountingProps) {
    super(scope, id);

    this.lambdaFn = new lambda.Function(this, "CustomerAccounting", {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "customer-accounting.handler",
    });
  }
}
