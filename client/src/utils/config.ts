export const config = {
  aws: {
    region: process.env.NEXT_PUBLIC_AWS_REGION!,
    cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!
    }
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ,
  }
};
