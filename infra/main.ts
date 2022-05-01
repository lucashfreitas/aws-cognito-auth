import * as cdk from "@aws-cdk/core";
import { AppStack } from "./stacks/awsCognitoTestStack";

//load .env root folder

if (!process.env.AWS_REGION || !process.env.AWS_ACCOUNT_ID) {
  require("dotenv").config({ path: __dirname + "/../.env" });
}


export interface AppConfig {
  region: string;
  accountId: string;
}

const config: AppConfig = {
  region: process.env.AWS_REGION as string,
  accountId: process.env.AWS_ACCOUNT_ID as string,
};

const validateConfig = (config: AppConfig) => {
  isRequired(config.region, "AWS_REGION");
  isRequired(config.accountId, "AWS_ACCOUNT_ID");
};

const isRequired = (data: any, fieldName: string) => {
  if (!data) {
    const msg = `${fieldName} is required`;
    throw new Error(msg);
  }
};

validateConfig(config);

const app = new cdk.App({});

const appStack = new AppStack(app, "AwsCognitoTestStack", {
  config,
  env: {
    account: config.accountId,
    region: config.region,
  },
});
