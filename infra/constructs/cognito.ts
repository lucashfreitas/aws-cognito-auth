import * as cognito from "@aws-cdk/aws-cognito";
import { ClientAttributes } from "@aws-cdk/aws-cognito";
import * as cdk from "@aws-cdk/core";
import { CfnOutput, Duration, RemovalPolicy } from "@aws-cdk/core";
import * as cr from "@aws-cdk/custom-resources";
export class Cognito extends cdk.Construct {
  public readonly userPoll: cognito.UserPool;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.userPoll = new cognito.UserPool(scope, `${id}pool`, {
      userPoolName: `${id}pool`,
      signInAliases: {
        username: false,
        email: true,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,

      passwordPolicy: {
        minLength: 6,
        requireLowercase: true,
        requireDigits: true,
        requireUppercase: false,
        requireSymbols: false,
      },
    });

    this.userPoll.applyRemovalPolicy(RemovalPolicy.DESTROY);

    const userPoolClient = new cognito.UserPoolClient(this, "userpool-client", {
      userPool: this.userPoll,
      generateSecret: true,
      readAttributes: new ClientAttributes().withStandardAttributes({
        address: true,
        email: true,
        fullname: true,
        familyName: true,
        middleName: true,
        givenName: true,
        profilePicture: true,
        phoneNumber: true,
        profilePage: true,
        nickname: true,
      }),

      accessTokenValidity: Duration.minutes(5),
      idTokenValidity: Duration.minutes(5),
      refreshTokenValidity: Duration.days(30),

      authFlows: {
        userPassword: true,
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    });

    const describeCognitoUserPoolClient = new cr.AwsCustomResource(
      this,
      "DescribeCognitoUserPoolClient",
      {
        resourceType: "Custom::DescribeCognitoUserPoolClient",
        onCreate: {
          region: "us-east-1",
          service: "CognitoIdentityServiceProvider",
          action: "describeUserPoolClient",
          parameters: {
            UserPoolId: this.userPoll.userPoolId,
            ClientId: userPoolClient.userPoolClientId,
          },

          physicalResourceId: cr.PhysicalResourceId.of(
            userPoolClient.userPoolClientId
          ),
        },
        // TODO: can we restrict this policy more?
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
          resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
        }),
      }
    );

    const userPoolClientSecret = describeCognitoUserPoolClient.getResponseField(
      "UserPoolClient.ClientSecret"
    );
    new cdk.CfnOutput(this, "ClientSecret", {
      value: userPoolClientSecret,
    });

    new CfnOutput(scope, "UserPoolId", {
      value: this.userPoll.userPoolId,
    });

    new CfnOutput(scope, "UserClientId", {
      value: userPoolClient.userPoolClientId,
    });
  }
}
