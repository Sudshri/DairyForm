import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { userApi } from '@/api/userApi';
import { setNotification } from '@/store/redux/uiSlice';
import { useAuthStore } from '@/store/authStore';

export function useProfile() {
  const user = useAuthStore((s) => s.user);

  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn:  async () => {
      try { return (await userApi.profile()).data; }
      catch { return user; }
    },
    initialData: user,
  });
}

export function useUpdateProfile() {
  const qc         = useQueryClient();
  const dispatch   = useDispatch();
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: (data) => userApi.updateProfile(data),
    onSuccess: (res) => {
      qc.invalidateQueries(['user', 'profile']);
      updateUser(res.data ?? res);
      dispatch(setNotification({ type: 'success', message: 'Profile updated successfully' }));
    },
    onError: () => {
      dispatch(setNotification({ type: 'error', message: 'Failed to update profile' }));
    },
  });
}

export function useChangePassword() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (data) => userApi.changePassword(data),
    onSuccess: () => dispatch(setNotification({ type: 'success', message: 'Password changed successfully' })),
    onError:   () => dispatch(setNotification({ type: 'error',   message: 'Incorrect current password' })),
  });
}

export function useAddresses() {
  return useQuery({
    queryKey: ['user', 'addresses'],
    queryFn:  async () => {
      try { return (await userApi.addresses()).data; }
      catch { return [
        { id:1, label:'Home', name:'Ramesh Kumar', phone:'+91 98765 43210',
          line1:'123 Farm Road', city:'Pune', state:'Maharashtra', pincode:'411013', isDefault:true },
      ]; }
    },
  });
}
