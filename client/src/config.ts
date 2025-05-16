export const config = {
  aws: {
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
      userPoolClientSecret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET
    }
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL
  }
};

// Log the config values (remove sensitive data in production)
console.log('Config loaded:', {
  region: config.aws.region,
  userPoolId: config.aws.cognito.userPoolId,
  userPoolClientId: config.aws.cognito.userPoolClientId,
  hasClientSecret: !!config.aws.cognito.userPoolClientSecret,
  apiBaseUrl: config.api.baseUrl
}); 