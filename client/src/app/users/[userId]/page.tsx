"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  useGetUserByIdQuery, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  User 
} from '@/state/api';
import { 
  ArrowLeft, 
  User as UserIcon, 
  Mail, 
  Shield, 
  Clock, 
  Activity, 
  Save, 
  Trash, 
  AlertCircle 
} from 'lucide-react';

export default function UserDetailsPage() {
  const router = useRouter();
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Interface for the form data
  interface UserFormData {
    name: string;
    email: string;
    role: string;
    status: string;
    password?: string;
  }
  
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    role: 'Employee',
    status: 'Active',
    password: '',
  });
  
  // Fetch user data
  const { 
    data: user, 
    isLoading: isLoadingUser, 
    error: userError 
  } = useGetUserByIdQuery(userId as string);
  
  // Update and delete mutations
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  
  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: '',
      });
    }
  }, [user]);
  
  // Form change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // If password is empty, exclude it from the update
      const updateData = formData.password 
        ? formData 
        : { name: formData.name, email: formData.email, role: formData.role, status: formData.status };
        
      await updateUser({
        ...updateData,
        userId: userId as string,
      }).unwrap();
      
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update user:', err);
      // Here you would typically show an error notification
    }
  };
  
  // Delete handler
  const handleDelete = async () => {
    try {
      await deleteUser(userId as string).unwrap();
      router.push('/users');
    } catch (err) {
      console.error('Failed to delete user:', err);
      setShowDeleteConfirm(false);
      // Here you would typically show an error notification
    }
  };
  
  // Navigation back to users list
  const goBack = () => {
    router.push('/users');
  };
  
  // Loading state
  if (isLoadingUser) {
    return (
      <div className="mx-auto pb-5 w-full px-4 sm:px-6 lg:px-8 ml-0 sm:ml-64">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
            <p className="mt-2 text-gray-600">Loading user details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (userError || !user) {
    return (
      <div className="mx-auto pb-5 w-full px-4 sm:px-6 lg:px-8 ml-0 sm:ml-64">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <AlertCircle className="w-10 h-10 mx-auto mb-2" />
            <p className="text-lg font-semibold">Failed to load user details</p>
            <p className="mt-1">The user may not exist or there was a problem fetching the data.</p>
            <button 
              onClick={goBack}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Back to Users
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mx-auto pb-5 w-full px-4 sm:px-6 lg:px-8 ml-0 sm:ml-64">
      {/* Page header */}
      <div className="py-6 flex items-center justify-between">
        <div>
          <button 
            onClick={goBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Users
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">User Details</h1>
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="user-form"
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded flex items-center"
                disabled={isUpdating}
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
              >
                Edit User
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded flex items-center"
                disabled={isDeleting}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* User content */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            {/* Profile section */}
            <div className="md:w-1/3 mb-6 md:mb-0 md:pr-8">
              <div className="flex flex-col items-center">
                <div className="h-32 w-32 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mb-4">
                  <span className="text-5xl font-semibold">{user.name.charAt(0)}</span>
                </div>
                <h2 className="text-xl font-bold text-center">{user.name}</h2>
                <span className={`mt-2 px-3 py-1 text-sm font-semibold rounded-full 
                  ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                    user.role === 'Manager' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'}`}
                >
                  {user.role}
                </span>
                <span className={`mt-2 px-3 py-1 text-sm font-semibold rounded-full 
                  ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {user.status}
                </span>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <div className="flex items-center mb-3">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                
                {user.createdAt && (
                  <div className="flex items-center mb-3">
                    <Clock className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-gray-500 text-sm">Account Created</span>
                      <p className="text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
                
                {user.lastLogin && (
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <span className="text-gray-500 text-sm">Last Login</span>
                      <p className="text-gray-700">{new Date(user.lastLogin).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Edit form section */}
            <div className="md:w-2/3 md:border-l md:pl-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {isEditing ? 'Edit User Information' : 'User Information'}
              </h3>
              
              <form id="user-form" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isUpdating}
                      required
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">{user.name}</div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isUpdating}
                      required
                    />
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">{user.email}</div>
                  )}
                </div>
                
                {isEditing && (
                  <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                      Password (Leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isUpdating}
                    />
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="role" className="block text-gray-700 text-sm font-medium mb-2">
                    Role
                  </label>
                  {isEditing ? (
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isUpdating}
                      required
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Employee">Employee</option>
                    </select>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">{user.role}</div>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="status" className="block text-gray-700 text-sm font-medium mb-2">
                    Status
                  </label>
                  {isEditing ? (
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isUpdating}
                      required
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md text-gray-800">{user.status}</div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="mb-4 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete User</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">{user.name}</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded flex items-center justify-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 