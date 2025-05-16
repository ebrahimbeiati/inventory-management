import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminDeleteUserCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { fromEnv } from "@aws-sdk/credential-providers";

// Initialize Cognito client
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'eu-west-2',
  credentials: fromEnv()
});

const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

if (!USER_POOL_ID || !CLIENT_ID) {
  throw new Error('Missing required Cognito configuration');
}

export interface CognitoUser {
  userId: string;
  email: string;
  role: string;
  status: string;
}

export class CognitoService {
  // Sign up a new user
  static async signUp(email: string, password: string): Promise<string> {
    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'custom:role', Value: 'employee' }
      ]
    });

    const response = await cognitoClient.send(command);
    return response.UserSub || '';
  }

  // Confirm user signup
  static async confirmSignUp(email: string, code: string): Promise<void> {
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code
    });

    await cognitoClient.send(command);
  }

  // Sign in user
  static async signIn(email: string, password: string): Promise<{ token: string; user: CognitoUser }> {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    });

    const response = await cognitoClient.send(command);
    
    if (!response.AuthenticationResult?.IdToken) {
      throw new Error('Authentication failed');
    }

    // Get user details
    const userDetails = await this.getUserDetails(email);
    
    return {
      token: response.AuthenticationResult.IdToken,
      user: userDetails
    };
  }

  // Get user details
  static async getUserDetails(email: string): Promise<CognitoUser> {
    const command = new AdminGetUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email
    });

    const response = await cognitoClient.send(command);
    
    const userAttributes = response.UserAttributes || [];
    const emailAttr = userAttributes.find(attr => attr.Name === 'email')?.Value || '';
    const roleAttr = userAttributes.find(attr => attr.Name === 'custom:role')?.Value?.toLowerCase() || 'employee';
    
    return {
      userId: response.Username || '',
      email: emailAttr,
      role: roleAttr,
      status: response.UserStatus || 'UNCONFIRMED'
    };
  }

  // Update user attributes
  static async updateUser(email: string, attributes: Record<string, string>): Promise<void> {
    const userAttributes = Object.entries(attributes).map(([key, value]) => ({
      Name: key,
      Value: value
    }));

    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: userAttributes
    });

    await cognitoClient.send(command);
  }

  // Delete user
  static async deleteUser(email: string): Promise<void> {
    const command = new AdminDeleteUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email
    });

    await cognitoClient.send(command);
  }

  // Create admin user
  static async createAdminUser(email: string, password: string): Promise<void> {
    const command = new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'custom:role', Value: 'admin' },
        { Name: 'email_verified', Value: 'true' }
      ],
      MessageAction: 'SUPPRESS'
    });

    await cognitoClient.send(command);

    // Set password for the user
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: USER_POOL_ID,
      Username: email,
      Password: password,
      Permanent: true
    });

    await cognitoClient.send(setPasswordCommand);
  }
} 