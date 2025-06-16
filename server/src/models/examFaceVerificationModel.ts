import pool from "../config/db";

export interface FaceVerificationInsert {
  registration_id: number;
  image_url: string;
  is_passed?: boolean;
}

export interface FaceVerificationUpdate {
  image_url?: string;
  is_passed?: boolean;
}

export const getAllFaceVerifications = async () => {
  const res = await pool.query("SELECT * FROM exam_face_verifications");
  return res.rows;
};

export const getFaceVerificationById = async (id: number) => {
  const res = await pool.query(
    "SELECT * FROM exam_face_verifications WHERE id = $1",
    [id]
  );
  return res.rows[0];
};

export const getFaceVerificationsByRegistrationId = async (
  registration_id: number
) => {
  const res = await pool.query(
    "SELECT * FROM exam_face_verifications WHERE registration_id = $1",
    [registration_id]
  );
  return res.rows;
};

export const createFaceVerification = async (face: FaceVerificationInsert) => {
  const { registration_id, image_url, is_passed } = face;
  const res = await pool.query(
    "INSERT INTO exam_face_verifications (registration_id, image_url, is_passed) VALUES ($1, $2, $3) RETURNING *",
    [registration_id, image_url, is_passed || false]
  );
  return res.rows[0];
};

export const updateFaceVerification = async (
  id: number,
  face: FaceVerificationUpdate
) => {
  const fields = [];
  const values = [];
  let idx = 1;
  for (const key in face) {
    const typedKey = key as keyof FaceVerificationUpdate;
    if (face[typedKey] !== undefined && face[typedKey] !== null) {
      fields.push(`${key} = $${idx}`);
      values.push(face[typedKey]);
      idx++;
    }
  }
  if (fields.length === 0) {
    const res = await pool.query(
      "SELECT * FROM exam_face_verifications WHERE id = $1",
      [id]
    );
    return res.rows[0];
  }
  values.push(id);
  const res = await pool.query(
    `UPDATE exam_face_verifications SET ${fields.join(
      ", "
    )} WHERE id = $${idx} RETURNING *`,
    values
  );
  return res.rows[0];
};

export const deleteFaceVerification = async (id: number) => {
  await pool.query("DELETE FROM exam_face_verifications WHERE id = $1", [id]);
};
