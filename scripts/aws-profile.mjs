#!/usr/bin/env zx

import chalk from "chalk";
import config from "./config.js";

try {
  await $`aws --profile ${config.profile} configure set aws_access_key_id ${config.accessKey}`;
  await $`aws --profile ${config.profile} configure set aws_secret_access_key ${config.secretKey}`;
  await $`aws --profile ${config.profile} configure set region ${config.region}`;

  console.log(
    chalk.green(`AWS PROFILE ${config.profile} successfully created`)
  );
} catch (error) {
  console.error(error);
}
