'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  RespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { config } from '@/utils/config';
import { useAuth } from '@/hooks/useAuth';
import { Home } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState('');
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Debug logging for initial render
  useEffect(() => {
    console.log('Login page mounted');
    console.log('Current user:', user);
    console.log('Config:', {
      region: config.aws.region,
      userPoolId: config.aws.cognito.userPoolId,
      userPoolClientId: config.aws.cognito.userPoolClientId
    });
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Login attempt with:', { email });

    try {
      const client = new CognitoIdentityProviderClient({
        region: config.aws.region
      });

      console.log('Auth configuration:', {
        region: config.aws.region,
        clientId: config.aws.cognito.userPoolClientId,
        authFlow: 'USER_PASSWORD_AUTH'
      });

      const command = new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: config.aws.cognito.userPoolClientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password
        }
      });

      console.log('Sending auth command...');
      const response = await client.send(command);
      console.log('Auth response:', JSON.stringify(response, null, 2));
      
      if (response.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        console.log('New password required challenge');
        setSession(response.Session || '');
        setShowNewPasswordForm(true);
        return;
      }

      if (response.AuthenticationResult) {
        console.log('Authentication successful');
        const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;
        
        if (!IdToken) {
          console.error('No ID token in response');
          throw new Error('No ID token received');
        }

        // Decode the ID token to get user information
        const tokenPayload = JSON.parse(atob(IdToken.split('.')[1]));
        console.log('Token payload:', tokenPayload);
        
        // Get role from Cognito attributes
        const role = tokenPayload['custom:role'] || 'employee';
        console.log('Role from Cognito:', role);
        
        // Store the tokens
        localStorage.setItem('idToken', IdToken);
        if (AccessToken) localStorage.setItem('accessToken', AccessToken);
        if (RefreshToken) localStorage.setItem('refreshToken', RefreshToken);
        
        // Store user info with role
        const userData = {
          email: tokenPayload.email || email,
          userId: tokenPayload.sub,
          role: role.toLowerCase(), // Use role from Cognito
          idToken: IdToken,
          accessToken: AccessToken
        };
        
        console.log('Storing user data:', userData);
        localStorage.setItem('user', JSON.stringify(userData));

        console.log('Redirecting to home...');
        window.location.href = '/';
        return;
      }

      console.error('Unexpected response format:', response);
      throw new Error('Authentication failed: Unexpected response format');
    } catch (err: unknown) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const client = new CognitoIdentityProviderClient({
        region: config.aws.region
      });

      const command = new RespondToAuthChallengeCommand({
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ClientId: config.aws.cognito.userPoolClientId,
        ChallengeResponses: {
          USERNAME: email,
          NEW_PASSWORD: newPassword
        },
        Session: session
      });

      const response = await client.send(command);
      console.log('New password response:', response);

      if (response.AuthenticationResult) {
        const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;
        
        if (!IdToken) {
          throw new Error('No ID token received');
        }

        // Decode the ID token to get user information
        const tokenPayload = JSON.parse(atob(IdToken.split('.')[1]));
        console.log('Token payload:', tokenPayload);
        
        // Store the tokens
        localStorage.setItem('idToken', IdToken);
        if (AccessToken) localStorage.setItem('accessToken', AccessToken);
        if (RefreshToken) localStorage.setItem('refreshToken', RefreshToken);
        
        // Store user info with role
        const userData = {
          email: tokenPayload.email || email,
          userId: tokenPayload.sub,
          role: 'admin', // Ensure lowercase 'admin'
          idToken: IdToken,
          accessToken: AccessToken
        };
        
        console.log('Storing user data:', userData);
        localStorage.setItem('user', JSON.stringify(userData));

        // Force a page reload to update auth state
        window.location.href = '/dashboard';
      }
    } catch (err: unknown) {
      console.error('New password error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to set new password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (showNewPasswordForm) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
            <p className="mt-2 text-sm text-gray-600">Please set a new password for your account</p>
          </div>
          
          <form onSubmit={handleNewPassword} className="space-y-6">
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Setting new password...' : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-sm text-gray-600">Please sign in with your admin credentials</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="flex justify-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}