# aws-cognito-auth

Tiny library that provides a simple API to interact with AWS Cognito. 

It's not complete and ready to be used in production yet (I am using it in personal projects) and have plans to update it as soon as I need more features, but feel free to fork or contribute to it.

This project is also an example on how to demonstrate how we can run integration tests integrated with AWS CDK. Check the folder the `test` section/github action logs for more details. 

Every time we push to the code, we deploy a new CDK Stack, run the integration tests and destroy it afterwoods.

It doesn't support all methods but the intention/goal is to add support to all common operations to provide end to end features for authentication (signup, login, etc).

You can also use this code as reference to know how to use AWS SDK for Cognito & execute testing/automations with AWS CDK & outputs.

# Documentation/APIs

More documentation will be available in the near future. Please have a quick look on the `examples` folder and in the types definition.

The current operations are supported

- refreshToken
- getUser
- login
- signup
- deleteUser
- revokeToken
- verifyIdToken
- verifyAccessToken 

# Usage / Requirements

- **NodeJS V14** or higher
- **AWS CLI** (required to run integration testing)
# Tests

This project relies only on integration tests and it's running by github actions.

In order to execute the tests you'll need valid AWS Credentials with permissions to create a new Cloudformation Stack with a Cognito User Pool.

Please refer to the `env.example` to see the required environment variables. 

If you want to run the test locally create a new `.env` file in the project root and run these commends in order:

- yarn aws-setup
- yarn infra:up
- yarn test:integration
# References

AWS Labs: https://github.com/awslabs/aws-support-tools/blob/master/Cognito/decode-verify-jwt/decode-verify-jwt.ts