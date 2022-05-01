#!/usr/bin/env zx

import chalk from "chalk";
import path from "path";
import { appendFileSync } from "fs";
import { getOutput } from "@basilog/infra";

const output = getOutput();

console.log(`${chalk.yellow(
  `The cloud infrastructure was deployed. Setting up some extra environment variables now. `
)}
`);

const envFileDir = path.join(__dirname, "..", ".env");
const envFileContent =
  [
    `# AWS CDK OUTPUT VARIABLES`,
    `AWS_COGNITO_POOL_ID=${output.CognitoUserPoolId}`,
    `AWS_COGNITO_CLIENT_ID=${output.CognitoUserClientId}`,
    `AWS_COGNITO_CLIENT_SECRET=${output.CognitoClientSecret}`,
  ].join("\n") + "\n";

appendFileSync(envFileDir, envFileContent, "utf8");

console.log(`${chalk.green(
  `Awesome! The local environment is ready and the Test cloud setup was deployed. `
)}
`);
