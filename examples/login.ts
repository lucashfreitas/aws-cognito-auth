
import { Cognito } from "../out";

const cognito = Cognito({
    UserPoolId: 'PoolId',
    ClientId: 'ClientId',
    ClientSecret: 'Client Secret',
    Region: 'Region',
  });
  


const handler = async (req: any,res) => {

  const cognitoLogin = await cognito.login({
    email: req.body.email,
    password: req.body.password
  });

  const idTokenClaims = await cognito.verifyIdToken(
    cognitoLogin.result.idToken
  );


  if (idTokenClaims.success) {
      //set cookie or set session , etc.

  
  }




}