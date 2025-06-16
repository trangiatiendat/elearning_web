export interface Submission {
  submission_id: number;
  student_id: number;
  student_name: string;
  submission_file_url: string | null;
  submitted_at: string;
  submission_grade: number | null;
  submission_feedback: string | null;
}

export interface AssignmentWithSubmissions {
  assignment_id: number;
  assignment_title: string;
  assignment_description: string | null;
  assignment_due_date: string | null;
  assignment_attachment_url: string | null;
  submissions: Submission[];
}

export interface CourseWithAssignmentsAndSubmissions {
  course_id: number;
  course_name: string;
  assignments: AssignmentWithSubmissions[];
}
