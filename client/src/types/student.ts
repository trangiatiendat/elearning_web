export interface StudentProfile {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  class?: string;
  school?: string;
  phone?: string;
  bio?: string;
  date_of_birth?: string;
  createdAt?: Date;
  updatedAt?: Date;
  created_at?: string;
}

export interface StudentProfileResponse {
  success: boolean;
  data: StudentProfile;
  error?: string;
}
