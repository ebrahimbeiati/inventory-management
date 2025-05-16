"use client";

import { useState, useEffect } from 'react';
import { Search, X, AlertCircle, Plus } from 'lucide-react';
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
import UserList from './UserList';
import UserForm, { UserFormData } from './UserForm';
import Button from '../components/ui/Button';

export default function UsersPage() {
  const { user: currentUser, isAdmin } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Check if user is admin, redirect if not
  useEffect(() => {
    if (!isAdmin()) {
      router.push('/login');
    }
  }, [isAdmin, router]);
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // API hooks
  const { data: users, isLoading, error } = useGetUsersQuery({ search: debouncedSearchTerm });
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  
  // Add debug logging
  useEffect(() => {
    console.log('Users Query State:', {
      isLoading,
      error,
      users,
      searchTerm: debouncedSearchTerm
    });
  }, [isLoading, error, users, debouncedSearchTerm]);
  
  // Handle user form submission (create/edit)
  const handleUserFormSubmit = async (userData: UserFormData) => {
    if (!isAdmin()) {
      alert('Only administrators can manage users');
      return;
    }

    try {
      console.log("Submitting user data:", userData);
      
      if (selectedUser) {
        // Update existing user
        await updateUser({
          userId: selectedUser.userId,
          ...userData
        }).unwrap();
        setSelectedUser(null);
        
        // Show success message
        alert(`User ${userData.email} was successfully updated`);
      } else {
        // Create new user
        await createUser({
          ...userData,
          name: userData.email.split('@')[0] // Use email prefix as name
        } as NewUser).unwrap();
        setIsModalOpen(false);
        
        // Show success message
        alert(`User ${userData.email} was successfully created`);
      }
    } catch (error: unknown) {
      console.error('Failed to save user:', error);
      
      let errorMessage = 'Failed to save user. Please try again.';
      
      if (error && typeof error === 'object') {
        const err = error as { data?: { message?: string }, status?: number };
        if (err.data?.message) {
          errorMessage = err.data.message;
        } else if (err.status === 400) {
          errorMessage = 'Please fill in all required fields.';
        } else if (err.status === 401) {
          errorMessage = 'Authentication failed. Please log out and log back in.';
        } else if (err.status === 403) {
          errorMessage = 'You do not have permission to manage users.';
        } else if (err.status === 409) {
          errorMessage = 'A user with this email already exists.';
        }
      }
      
      alert(errorMessage);
    }
  };
  
  // Handle user deletion
  const handleUserDelete = async (user: User) => {
    if (!isAdmin()) {
      alert('Only administrators can delete users');
      return;
    }
    
    try {
      await deleteUser(user.userId).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      
      alert(`User ${user.email} was successfully deleted`);
    } catch (error: unknown) {
      console.error('Failed to delete user:', error);
      
      let errorMessage = 'Failed to delete user. Please try again.';
      
      if (error && typeof error === 'object') {
        const err = error as { status?: number };
        if (err.status === 404) {
          errorMessage = 'User not found. It may have been already deleted.';
        } else if (err.status === 403) {
          errorMessage = 'You do not have permission to delete this user.';
        }
      }
      
      alert(errorMessage);
    }
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
                  placeholder="Search users by email or role" 
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
                    <span>Searching for &quot;{debouncedSearchTerm}&quot;...</span>
                  ) : users?.length === 0 ? (
                    <span>No results found for &quot;{debouncedSearchTerm}&quot;</span>
                  ) : (
                    <span>Showing results for &quot;{debouncedSearchTerm}&quot;</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {isAdmin() && (
                <Button
                  onClick={() => setIsModalOpen(true)}
                  disabled={isCreating}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* User List */}
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
          <UserList
            users={users || []}
            onEdit={(user) => {
              setSelectedUser(user);
              setIsModalOpen(true);
            }}
            onDelete={(userId) => {
              const userToDelete = users?.find(u => u.userId === userId);
              if (userToDelete) {
                setSelectedUser(userToDelete);
                setIsDeleteModalOpen(true);
              }
            }}
            loading={isLoading}
          />
        )}
      </div>
      
      {/* User create/edit modal */}
      {isAdmin() && (
        <UserForm 
          open={isModalOpen || !!selectedUser} 
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          initialData={selectedUser || undefined}
          isEditing={!!selectedUser}
          onSubmit={handleUserFormSubmit}
        />
      )}
      
      {/* Delete confirmation modal */}
      {isAdmin() && selectedUser && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isDeleteModalOpen ? '' : 'hidden'}`}>
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="mb-4 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete User</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold">{selectedUser.email}</span>? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => handleUserDelete(selectedUser)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}