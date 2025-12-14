'use client';

import { useState } from 'react';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/lib/hooks/useUsers';
import type { User, CreateUserData, UpdateUserData } from '@/types/user';
import UserForm from './UserForm';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

export default function UserManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { data: users = [], isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser.mutateAsync(userToDelete.id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch {
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleSubmit = async (data: CreateUserData | UpdateUserData) => {
    try {
      if (editingUser?.id) {
        await updateUser.mutateAsync({ id: editingUser.id, data: data as UpdateUserData });
      } else {
        await createUser.mutateAsync(data as CreateUserData);
      }
      setIsFormOpen(false);
      setEditingUser(null);
    } catch {
    }
  };

  const handleClose = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">User Management</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-primary-foreground cursor-pointer rounded-md hover:bg-primary-hover transition-colors"
        >
          + Create User
        </button>
      </div>

      {isFormOpen && (
        <UserForm
          key={editingUser?.id || 'new'}
          user={editingUser}
          onSubmit={handleSubmit}
          onClose={handleClose}
          isLoading={createUser.isPending || updateUser.isPending}
        />
      )}

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'Administrator'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-primary hover:text-primary-hover mr-4 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-danger hover:text-danger-hover cursor-pointer"
                        disabled={deleteUser.isPending}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.firstName} ${userToDelete?.lastName}"? This action cannot be undone.`}
        isLoading={deleteUser.isPending}
      />
    </div>
  );
}

