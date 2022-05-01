
import { Cognito } from "../out";

const cognito = Cognito({
    UserPoolId: 'PoolId',
    ClientId: 'ClientId',
    ClientSecret: 'Client Secret',
    Region: 'Region',
  });
  


const handler = async (req: any,res) => {

  const cognitoSignup = await cognito.signup({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  });

  if(cognitoSignup.success) {
    //all good
  }
}