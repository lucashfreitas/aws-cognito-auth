import "dotenv/config";

const config = {
  profile: process.env.AWS_PROFILE || 'awsCognitoAuthTest',
  region: process.env.AWS_REGION,
  accountId: process.env.AWS_ACCOUNT_ID,
  accessKey: process.env.AWS_ACCESS_KEY_ID,
  secretKey: process.env.AWS_SECRET_ACCESS_KEY,
};

if (
  !config.accessKey ||
  !config.profile ||
  !config.region ||
  !config.secretKey ||
  !config.accountId
) {
  console.error(config);
  throw new Error("Missing configuration");
}

export default config;
