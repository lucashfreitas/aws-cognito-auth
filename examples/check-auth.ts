
import { Cognito, CognitoVerifyTokenErrors } from "../out";

const cognito = Cognito({
    UserPoolId: 'PoolId',
    ClientId: 'ClientId',
    ClientSecret: 'Client Secret',
    Region: 'Region',
  });
  


  /**
   * You can decide how your application will interact/store the JWT. 
   * @param req 
   * @param res 
   */
const handler = async (req: any,res) => {

  const accessToken = req.headers['x-auth-token'] // You can get it from cookies or via http headers, etc. It's entirely up to you.
  const refreshToken = req.headers['x-auth-refresh-token']
  const userId = req.cookies['COOKIE_USER_ID']
  const verifyTokenResult = await cognito.verifyAccessToken(
    accessToken
  );


  if(verifyTokenResult.success) {
    //all good
  }

   //check if token is expired and it needs to be renewed
   if (verifyTokenResult.error?.code === CognitoVerifyTokenErrors.Expired) {
    const refreshTokenResult = await cognito.refreshToken({
      refreshToken: refreshToken,
      userId,
    });

    //
    if (refreshTokenResult.success) {
      //new access token refreshed
      return refreshTokenResult.result.accessToken
      //error unauthenticated;
    }


    return false; //error



 
  }

  return false //errors





}