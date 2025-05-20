import { Amplify } from 'aws-amplify';
import { config } from './utils/config';
// Debug environment variables
console.log('Environment Variables Check:', {
  NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
  NEXT_PUBLIC_COGNITO_USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  NODE_ENV: process.env.NODE_ENV
});

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: config.aws.cognito.userPoolId,
      userPoolClientId: config.aws.cognito.userPoolClientId,
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
        phone: false,
        username: false
      }
    },
    region: config.aws.region
  }
};


// Validate required configuration
if (!awsConfig.Auth.Cognito.userPoolId || !awsConfig.Auth.Cognito.userPoolClientId || !awsConfig.Auth.region) {
  console.error('Missing required AWS Cognito configuration:', {
    region: awsConfig.Auth.region,
    userPoolId: awsConfig.Auth.Cognito.userPoolId,
    userPoolClientId: awsConfig.Auth.Cognito.userPoolClientId
  });
  throw new Error('Missing required AWS Cognito configuration');
}

try {
  Amplify.configure(awsConfig);
  
  // Verify the configuration
  const currentConfig = Amplify.getConfig();
  console.log('Current Amplify Config:', JSON.stringify(currentConfig, null, 2));
} catch (error) {
  console.error('Error configuring to Amplify:', error);
  throw error; // Re-throw to prevent app from running with invalid config
}

export default awsConfig;
