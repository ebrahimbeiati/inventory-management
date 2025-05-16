export const config = {
  aws: {
    region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-west-2',
    cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'eu-west-2_sACvhQq3X',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '50sg9ugui3m9568fjtqo4ah2ad',
      userPoolClientSecret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET
    }
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://unyca5yulf.execute-api.eu-west-2.amazonaws.com/prod'
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