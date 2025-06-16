import pool from "../config/db";

export interface AssignmentUpdate {
  title?: string;
  description?: string;
  due_date?: string;
  attachment_url?: string;
}

export const getAllAssignments = async () => {
  const res = await pool.query("SELECT * FROM assignments");
  return res.rows;
};

export const getAssignmentById = async (id: number) => {
  const res = await pool.query(
    `SELECT a.*, t.course_id, t.title AS topic_title, c.name AS course_name
     FROM assignments a
     JOIN course_topics t ON a.topic_id = t.id
     JOIN courses c ON t.course_id = c.id
     WHERE a.id = $1`,
    [id]
  );
  return res.rows[0];
};

export const getAssignmentsByTopicId = async (topic_id: number) => {
  const res = await pool.query(
    "SELECT * FROM assignments WHERE topic_id = $1",
    [topic_id]
  );
  return res.rows;
};

export const createAssignment = async (assignment: {
  topic_id: number;
  title: string;
  description?: string;
  due_date?: string;
  attachment_url?: string;
}) => {
  const { topic_id, title, description, due_date, attachment_url } = assignment;
  const res = await pool.query(
    "INSERT INTO assignments (topic_id, title, description, due_date, attachment_url) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      topic_id,
      title,
      description || null,
      due_date || null,
      attachment_url || null,
    ]
  );
  return res.rows[0];
};

export const updateAssignment = async (
  id: number,
  assignment: AssignmentUpdate
) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in assignment) {
    const typedKey = key as keyof AssignmentUpdate;
    if (assignment[typedKey] !== undefined && assignment[typedKey] !== null) {
      fields.push(`${key} = $${idx}`);
      values.push(assignment[typedKey]);
      idx++;
    }
  }
  if (fields.length === 0) {
    const res = await pool.query("SELECT * FROM assignments WHERE id = $1", [
      id,
    ]);
    return res.rows[0];
  }
  values.push(id);
  const res = await pool.query(
    `UPDATE assignments SET ${fields.join(
      ", "
    )} WHERE id = $${idx} RETURNING *`,
    values
  );
  return res.rows[0];
};

export const deleteAssignment = async (id: number) => {
  await pool.query("DELETE FROM assignments WHERE id = $1", [id]);
};

export const getAssignmentsByTeacherId = async (teacher_id: number) => {
  const res = await pool.query(
    `SELECT a.id, a.topic_id, a.title, a.description, a.due_date, a.created_at, a.attachment_url,
            t.course_id, t.title AS topic_title, c.name AS course_name
     FROM assignments a
     JOIN course_topics t ON a.topic_id = t.id
     JOIN courses c ON t.course_id = c.id
     WHERE c.teacher_id = $1
     ORDER BY a.created_at DESC`,
    [teacher_id]
  );
  return res.rows;
};

// Get assignments by student ID
export const getAssignmentsByStudentId = async (studentId: number) => {
  const res = await pool.query(
    `SELECT a.*,
            t.id AS topic_id,
            t.title AS topic_title,
            t.course_id,
            c.name AS course_name,
            s.id AS submission_id,
            s.file_url AS submission_file_url,
            s.submitted_at,
            s.grade AS submission_grade,
            s.feedback AS submission_feedback,
            CASE
                WHEN s.id IS NOT NULL AND s.grade IS NOT NULL THEN 'graded'
                WHEN s.id IS NOT NULL THEN 'submitted'
                ELSE 'pending'
            END AS status
      FROM assignments a
      JOIN course_topics t ON a.topic_id = t.id
      JOIN courses c ON t.course_id = c.id
      JOIN student_courses sc ON c.id = sc.course_id
      LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.student_id = sc.student_id
      WHERE sc.student_id = $1
      ORDER BY a.due_date ASC NULLS LAST, a.created_at DESC`,
    [studentId]
  );
  return res.rows;
};

// Get courses, assignments, and student submissions for a teacher
export const getCourseAssignmentsAndSubmissionsForTeacher = async (
  teacherId: number
) => {
  const res = await pool.query(
    `SELECT
        c.id AS course_id,
        c.name AS course_name,
        a.id AS assignment_id,
        a.title AS assignment_title,
        a.description AS assignment_description,
        a.due_date AS assignment_due_date,
        a.attachment_url AS assignment_attachment_url,
        s.id AS submission_id,
        s.student_id,
        u.name AS student_name,
        s.file_url AS submission_file_url,
        s.submitted_at,
        s.grade AS submission_grade,
        s.feedback AS submission_feedback
    FROM courses c
    JOIN course_topics t ON c.id = t.course_id
    JOIN assignments a ON t.id = a.topic_id
    JOIN student_courses sc ON c.id = sc.course_id
    JOIN users u ON sc.student_id = u.id
    LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND sc.student_id = s.student_id
    WHERE c.teacher_id = $1
    ORDER BY c.name, a.due_date ASC NULLS LAST, u.name`, // Order for easier processing
    [teacherId]
  );

  // Group results by course and then by assignment
  const result = res.rows.reduce((acc: any[], row: any) => {
    let course = acc.find((c: any) => c.course_id === row.course_id);
    if (!course) {
      course = {
        course_id: row.course_id,
        course_name: row.course_name,
        assignments: [],
      };
      acc.push(course);
    }

    let assignment = course.assignments.find(
      (a: any) => a.assignment_id === row.assignment_id
    );
    if (!assignment) {
      assignment = {
        assignment_id: row.assignment_id,
        assignment_title: row.assignment_title,
        assignment_description: row.assignment_description,
        assignment_due_date: row.assignment_due_date,
        assignment_attachment_url: row.assignment_attachment_url,
        submissions: [],
      };
      course.assignments.push(assignment);
    }

    if (row.submission_id) {
      assignment.submissions.push({
        submission_id: row.submission_id,
        student_id: row.student_id,
        student_name: row.student_name,
        submission_file_url: row.submission_file_url,
        submitted_at: row.submitted_at,
        submission_grade: row.submission_grade,
        submission_feedback: row.submission_feedback,
      });
    }

    return acc;
  }, []);

  return result;
};
