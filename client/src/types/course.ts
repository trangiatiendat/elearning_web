export interface NewMaterial {
  type: string;
  title: string;
  url: string;
}

export interface NewTopic {
  title: string;
  description?: string;
  materials: NewMaterial[];
}

export interface Material {
  id: number;
  topic_id: number;
  type: string;
  title: string;
  url: string;
  uploaded_at: string;
}

export interface Topic {
  id: number;
  title: string;
  description?: string;
  materials: Material[];
}

export interface CourseFormData {
  name: string;
  description: string;
  image_url?: string;
  password: string;
  topics: NewTopic[];
}

export interface Course {
  id: number;
  teacher_id: number;
  created_at: string;
  name: string;
  description: string;
  image_url?: string;
  password: string;
  topics: Topic[];
  teacher_name?: string;
}

export interface CreateCourseDTO {
  name: string;
  description?: string;
  teacher_id: number;
  password: string;
}

export interface UpdateCourseDTO {
  name?: string;
  description?: string;
  teacher_id?: number;
  password?: string;
}
