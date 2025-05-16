import { CognitoService } from '../services/cognitoService';

async function updateUserToAdmin(email: string) {
  try {
    // Update user attributes to set role as admin
    await CognitoService.updateUser(email, {
      'custom:role': 'admin'
    });
    console.log(`Successfully updated ${email} to admin role`);
  } catch (error) {
    console.error('Error updating user role:', error);
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address');
  process.exit(1);
}

updateUserToAdmin(email); 