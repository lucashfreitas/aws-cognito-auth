import * as cdk from "@aws-cdk/core";
import { Environment } from "@aws-cdk/core";
import { Cognito } from "../constructs/cognito";
import { AppConfig } from "../main";

interface BasilogAppProps extends cdk.StackProps {
  config: AppConfig;
}

const env: Environment = {
  account: process.env.CDK_DEPLOY_ACCOUNT,
  region: process.env.CDK_DEPLOY_REGION,
};

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: BasilogAppProps) {
    super(scope, id, props);
    const { config } = props;
    const cognito = new Cognito(this, `AwsCognitoAuthTest`);

  }
}
