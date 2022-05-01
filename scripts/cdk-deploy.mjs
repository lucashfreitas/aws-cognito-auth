#!/usr/bin/env zx

import chalk from "chalk";
import config from "./config.js";

try {
  const deploy =
    await $`cd infra && yarn up --require-approval never --profile ${config.profile}`;
  console.log(chalk.green(`AWS Stack deployed`), deploy);
} catch (error) {
  console.error(error);
}
