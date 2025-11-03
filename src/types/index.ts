export type UserRole = 'admin' | 'karyawan';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}