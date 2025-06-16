export interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string; // ISO string
  courseId: number;
  courseName?: string; // optional, for display
  topicId: number;
  topicTitle?: string;
  created_at?: string;
  attachment_url?: string;
  status?: "pending" | "submitted" | "graded"; // for student view
  score?: number; // điểm số nếu đã chấm
  totalSubmissions?: number; // for teacher view
  submission_file_url?: string;
  submitted_at?: string;
  submission_grade?: number;
  submission_feedback?: string;
}

export interface CreateAssignmentDTO {
  title: string;
  description: string;
  dueDate: string; // ISO string
  courseId: number;
  topicId: number;
}

export interface UpdateAssignmentDTO {
  title?: string;
  description?: string;
  dueDate?: string;
  courseId?: number;
  topicId?: number;
}
