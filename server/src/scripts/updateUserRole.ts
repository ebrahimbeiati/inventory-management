import { CognitoService } from '../services/cognitoService';

async function updateUserToAdmin(email: string) {
  try {
    // Update user attributes to set role as admin
    await CognitoService.updateUser(email, {
      'custom:role': 'admin'
    });
  } catch (error) {
    console.error('Error updating user role:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  process.exit(1);
}

updateUserToAdmin(email); 