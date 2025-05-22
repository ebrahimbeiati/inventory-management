export const config = {
  aws: {
    region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-east-1_6k3vuDzu9',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'g6j6sb09igcm2gfd0dg5eu98u'
    }
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://0djagpee6l.execute-api.us-east-1.amazonaws.com/prod',
  }
};
