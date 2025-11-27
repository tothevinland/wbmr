import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/axios';
import { AuthResponse, SignupInput, LoginInput } from '@/lib/schemas';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export function useSignup() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: SignupInput) => {
      const { data } = await apiClient.post<AuthResponse>('/auth/signup', credentials);
      return data;
    },
    onSuccess: (data) => {
      login(data.data.access_token, data.data.user);
      toast.success('Account created successfully!');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Signup failed');
    },
  });
}

export function useLogin() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return data;
    },
    onSuccess: (data) => {
      login(data.data.access_token, data.data.user);
      toast.success('Login successful!');
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed');
    },
  });
}

