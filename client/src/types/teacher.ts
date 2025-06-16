export interface TeacherProfile {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  specialization?: string;
  qualifications?: string[];
  date_of_birth?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface TeacherProfileResponse {
  success: boolean;
  data: TeacherProfile;
  error?: string;
}

export interface CreateCoursePayload {
  name: string;
  description: string;
  teacher_id: number;
  topics: Array<{
    title: string;
    description: string;
    materials?: Array<{
      type: "video" | "pdf" | "other";
      title: string;
      url: string;
    }>;
  }>;
}
