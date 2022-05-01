interface Output {
  CognitoUserClientId: string;
  CognitoUserPoolId: string;
  CognitoClientSecret: string;
}

export const getOutput: () => Output = () => {
  const cdkOutput = require("./cdk-outputs.json");

  const poolId = cdkOutput.AwsCognitoTestStack.UserPoolId;
  const clientId = cdkOutput.AwsCognitoTestStack.UserClientId;

  let clientSecret: string = "";
  for (const [key, value] of Object.entries(cdkOutput.AwsCognitoTestStack)) {
    if (key.indexOf("ClientSecret") !== -1) {
      clientSecret = value as string;
    }
  }

  
  if (!clientId || !poolId || !clientSecret) {
    throw new Error("Configuration not found in cdk output.");
  }

  return {
    CognitoUserClientId: clientId,
    CognitoUserPoolId: poolId,
    CognitoClientSecret: clientSecret,
  };
};
