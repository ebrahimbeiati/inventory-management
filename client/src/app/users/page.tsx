"use client";

import { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Filter, X, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  useGetUsersQuery, 
  useCreateUserMutation, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  User,
  NewUser
} from '@/state/api';
import { useAuth } from '@/hooks/useAuth';

// Define the user form data type
interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  status: string;
}

// User form modal component
function UserFormModal({ 
  isOpen, 
  onClose, 
  user = null, 
  onSubmit 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  user?: User | null; 
  onSubmit: (userData: UserFormData) => void;
}) {
  const isEditing = !!user;
  
  const [formData, setFormData] = useState<UserFormData>(
    user ? 
    { 
      name: user.name, 
      email: user.email, 
      role: user.role, 
      status: user.status,
      password: '' // Password field is empty when editing
    } : 
    { 
      name: '', 
      email: '', 
      password: '', 
      role: 'Employee', 
      status: 'Active' 
    }
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: UserFormData) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For editing, if password is empty, exclude it from the data sent to API
    const submitData = { ...formData };
    if (isEditing && submitData.password === '') {
      const { password, ...dataWithoutPassword } = submitData;
      onSubmit(dataWithoutPassword);
    } else {
      onSubmit(submitData);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit User' : 'Create New User'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              {isEditing ? 'Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required={!isEditing}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {isEditing ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Confirmation modal for delete
function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  userName: string;
}) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="mb-4 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Delete User</h3>
          <p className="text-gray-600">
            Are you sure you want to delete <span className="font-semibold">{userName}</span>? This action cannot be undone.
          </p>
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  
  // Check if user is admin, redirect if not
  useEffect(() => {
    if (user && user.role !== 'Admin') {
      alert('Access denied. User management is only available to admin users.');
      router.push('/dashboard');
    }
  }, [user, router]);
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // API hooks
  const { data: users, isLoading, error } = useGetUsersQuery({ search: debouncedSearchTerm });
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUserMutation, { isLoading: isDeleting }] = useDeleteUserMutation();
  
  // Handle user form submission (create/edit)
  const handleUserFormSubmit = async (userData: UserFormData) => {
    try {
      console.log("Submitting user data:", userData);
      
      if (editUser) {
        // Update existing user
        await updateUser({
          ...userData,
          userId: editUser.userId
        }).unwrap();
        setEditUser(null);
        
        // Show success message
        alert(`User ${userData.name} was successfully updated`);
      } else {
        // For new users, password is required
        if (!userData.password) {
          alert('Password is required for new users');
          return;
        }
        
        // Create new user - ensure password is not undefined for new users
        await createUser({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          status: userData.status
        }).unwrap();
        setIsCreateModalOpen(false);
        
        // Show success message
        alert(`User ${userData.name} was successfully created`);
      }
    } catch (error) {
      console.error('Failed to save user:', error);
      
      // Extract error message for user display
      let errorMessage = 'Failed to save user. Please try again.';
      
      // Check if the error has data with message
      if (error && typeof error === 'object') {
        if ('data' in error && error.data) {
          if (typeof error.data === 'string') {
            // Try to parse HTML error messages
            if (error.data.includes('Cannot POST')) {
              errorMessage = 'The server could not process your request. The user creation endpoint may not be configured correctly.';
            } else {
              errorMessage = 'Server error: ' + error.data.replace(/<[^>]*>/g, '').trim();
            }
          } else if (typeof error.data === 'object' && 'message' in error.data) {
            errorMessage = typeof error.data.message === 'string' 
              ? error.data.message 
              : 'Unknown error occurred';
          }
        }
        
        // Check status code for more specific errors
        if ('status' in error) {
          if (error.status === 400) {
            errorMessage = 'Please fill in all required fields.';
          } else if (error.status === 401) {
            errorMessage = 'Authentication failed. Please log out and log back in to refresh your session.';
            // Check if token is missing entirely
            const token = localStorage.getItem('token');
            if (!token) {
              errorMessage = 'You are not logged in. Please log in to perform this action.';
            }
          } else if (error.status === 403) {
            errorMessage = 'You do not have permission to create or modify users. This action requires admin privileges.';
          } else if (error.status === 409) {
            errorMessage = 'A user with this email already exists.';
          }
        }
      }
      
      // Display the error to the user
      alert(errorMessage);
    }
  };
  
  // Handle user deletion
  const handleUserDelete = async () => {
    if (!deleteUser) return;
    
    try {
      await deleteUserMutation(deleteUser.userId).unwrap();
      setDeleteUser(null);
      
      // Show success message (you can replace this with a toast notification library later)
      alert(`User ${deleteUser.name} was successfully deleted`);
    } catch (error) {
      console.error('Failed to delete user:', error);
      
      // Extract error message for user display
      let errorMessage = 'Failed to delete user. Please try again.';
      
      // Check if the error has data with message
      if (error && typeof error === 'object') {
        if ('data' in error && error.data) {
          if (typeof error.data === 'string') {
            // Try to parse HTML error messages
            if (error.data.includes('Cannot DELETE')) {
              errorMessage = 'The server could not process your delete request. The user may not exist or you may not have permission.';
            } else {
              errorMessage = 'Server error: ' + error.data.replace(/<[^>]*>/g, '').trim();
            }
          } else if (typeof error.data === 'object' && 'message' in error.data) {
            errorMessage = typeof error.data.message === 'string' 
              ? error.data.message 
              : 'Unknown error occurred';
          }
        }
        
        // Check status code
        if ('status' in error) {
          if (error.status === 404) {
            errorMessage = 'User not found. It may have been already deleted.';
          } else if (error.status === 403) {
            errorMessage = 'You do not have permission to delete this user.';
          }
        }
      }
      
      // Display the error to the user
      alert(errorMessage);
    }
  };

  // Navigate to user details
  const navigateToUserDetails = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  return (
    <div className="mx-auto pb-5 w-full px-4 sm:px-6 lg:px-8 ml-0 sm:ml-64">
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600 dark:text-white">Manage your system users and permissions</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center border-2 border-gray-300 rounded">
                <Search className="w-4 h-4 text-gray-500 m-2" />
                <input 
                  type="text" 
                  placeholder="Search users by name, email or role" 
                  className="w-full py-2 px-4 rounded bg-white" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-600 mr-2"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {debouncedSearchTerm && (
                <div className="mt-2 text-sm text-gray-500">
                  {isLoading ? (
                    <span>Searching for "{debouncedSearchTerm}"...</span>
                  ) : users?.length === 0 ? (
                    <span>No results found for "{debouncedSearchTerm}"</span>
                  ) : (
                    <span>Showing results for "{debouncedSearchTerm}"</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                disabled={isCreating}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>
        
        {/* User Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <AlertCircle className="w-10 h-10 mx-auto mb-2" />
              <p>Failed to load users. Please try again later.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <tr 
                      key={user.userId} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={(e) => {
                        // Only navigate if not clicking on action buttons
                        if (!(e.target as HTMLElement).closest('button')) {
                          navigateToUserDetails(user.userId);
                        }
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 font-medium">{user.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 hover:text-blue-600">{user.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                            user.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            setEditUser(user);
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          disabled={isUpdating}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            setDeleteUser(user);
                          }}
                          className="text-red-600 hover:text-red-900"
                          disabled={isDeleting}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      {searchTerm ? 'No users found matching your search criteria' : 'No users found in the system'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* User create/edit modal */}
      <UserFormModal 
        isOpen={isCreateModalOpen || !!editUser} 
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditUser(null);
        }}
        user={editUser}
        onSubmit={handleUserFormSubmit}
      />
      
      {/* Delete confirmation modal */}
      {deleteUser && (
        <DeleteConfirmationModal
          isOpen={!!deleteUser}
          onClose={() => setDeleteUser(null)}
          onConfirm={handleUserDelete}
          userName={deleteUser.name}
        />
      )}
    </div>
  );
}