import * as courseModel from "../models/courseModel";
import * as topicModel from "../models/courseTopicModel";
import * as materialModel from "../models/courseMaterialModel";
import pool from "../config/db";

interface CreateFullCourseDTO {
  name: string;
  description?: string;
  teacher_id: number;
  topics?: {
    title: string;
    description?: string;
    materials?: {
      type: "video" | "pdf" | "other";
      title: string;
      url: string;
    }[];
  }[];
  password: string;
  image_url?: string;
}

export const createFullCourse = async (courseData: CreateFullCourseDTO) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Create the course
    const course = await courseModel.createCourse({
      name: courseData.name,
      description: courseData.description,
      teacher_id: courseData.teacher_id,
      password: courseData.password,
      image_url: courseData.image_url,
    });

    // 2. Create topics if provided
    if (courseData.topics && courseData.topics.length > 0) {
      for (const topicData of courseData.topics) {
        // Create topic
        const topic = await topicModel.createTopic({
          course_id: course.id,
          title: topicData.title,
          description: topicData.description,
        });

        // 3. Create materials if provided
        if (topicData.materials && topicData.materials.length > 0) {
          for (const materialData of topicData.materials) {
            await materialModel.createMaterial({
              topic_id: topic.id,
              type: materialData.type,
              title: materialData.title,
              url: materialData.url,
            });
          }
        }
      }
    }

    await client.query("COMMIT");
    return course;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
