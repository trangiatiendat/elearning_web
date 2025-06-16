export interface Exam {
  id: number;
  title: string;
  description?: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  course_id: number;
  course_name?: string;
  questions: ExamQuestion[];
}

export interface ExamForm {
  title: string;
  description?: string;
  duration_minutes: number;
  start_time: string;
  end_time: string;
  course_id: number | string;
}

export interface ExamQuestion {
  id: number;
  exam_id: number;
  question_text: string;
  options: string[];
  correct_answer: string;
}

export interface ExamResult {
  id: number;
  exam_id: number;
  student_id: number;
  score: number;
  submitted_at: string;
}

export interface ExamQuestionForm {
  question_text: string;
  options: string[];
  correct_answer: string;
}

export interface ExamResultWithStudent extends ExamResult {
  student_id: number;
  student_name: string;
  student_email?: string;
  submitted_at: string;
  score: number;
}
