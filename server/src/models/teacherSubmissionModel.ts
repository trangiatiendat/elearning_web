import pool from "../config/db"; // Assuming a db connection helper exists and exports pool as default

export const getCourseAssignmentsAndSubmissionsByTeacherId = async (
  teacherId: number
) => {
  // TODO: Implement database query to fetch courses, assignments, and submissions
  // for the given teacherId.
  // The query should return data structured to match the frontend's CourseWithAssignmentsAndSubmissions type.

  try {
    // This is a placeholder. Replace with your actual database query logic.
    // You will likely need to join courses, assignments, submissions, and users tables.
    // Grouping and structuring the results to match the desired nested format (courses -> assignments -> submissions) will be crucial.

    // Example using raw SQL (adjust based on your DB library/ORM):
    const result = await pool.query(
      `
      SELECT
          c.id AS course_id,
          c.name AS course_name,
          a.id AS assignment_id,
          a.title AS assignment_title,
          s.id AS submission_id,
          s.student_id,
          u.name AS student_name,
          s.file_url AS submission_file_url,
          s.submitted_at,
          s.grade AS submission_grade,
          s.feedback AS submission_feedback
      FROM courses c
      JOIN assignments a ON c.id = a.course_id
      LEFT JOIN submissions s ON a.id = s.assignment_id
      LEFT JOIN users u ON s.student_id = u.id -- Assuming users table contains student names
      WHERE c.teacher_id = $1 -- Assuming courses table has a teacher_id column
      ORDER BY c.name, a.due_date, s.submitted_at;
      `,
      [teacherId]
    );

    // Process the flat result into the nested structure
    const coursesMap = new Map();

    result.rows.forEach((row: any) => {
      if (!coursesMap.has(row.course_id)) {
        coursesMap.set(row.course_id, {
          course_id: row.course_id,
          course_name: row.course_name,
          assignments: [],
        });
      }

      const course = coursesMap.get(row.course_id);
      let assignment = course.assignments.find(
        (a: any) => a.assignment_id === row.assignment_id
      );

      if (!assignment) {
        assignment = {
          assignment_id: row.assignment_id,
          assignment_title: row.assignment_title,
          submissions: [],
        };
        course.assignments.push(assignment);
      }

      // Add submission only if it exists (LEFT JOIN might produce rows with null submission data)
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
    });

    return Array.from(coursesMap.values());
  } catch (error: any) {
    console.error(
      "Error in getCourseAssignmentsAndSubmissionsByTeacherId:",
      error
    );
    throw error; // Re-throw the error for the controller to handle
  }
};
