import { Request, Response } from "express";
import * as teacherSubmissionModel from "../../models/teacherSubmissionModel"; // We will create this model file

export const getCourseAssignmentsAndSubmissions = async (
  req: Request,
  res: Response
) => {
  const teacherId = (req as any).user?.id; // Assuming user ID is attached to request by auth middleware

  if (!teacherId) {
    res.status(401).json({ message: "Teacher ID not found in request." });
    return;
  }

  try {
    const data =
      await teacherSubmissionModel.getCourseAssignmentsAndSubmissionsByTeacherId(
        teacherId
      );
    res.json(data);
  } catch (error: any) {
    console.error("Error fetching teacher submissions:", error);
    res.status(500).json({
      message: "Error fetching teacher submissions",
      error: error.message,
    });
  }
};
