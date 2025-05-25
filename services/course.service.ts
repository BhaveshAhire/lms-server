import { Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import courseModel from "../models/course.model";

// create new course
export const createCourse = CatchAsyncErrors(
  async (data: any, res: Response) => {
    const course = await courseModel.create(data);
    res.status(201).json({
      success: true,
      course,
    });
  }
);

// get All Courses
export const getAllCoursesService = async (res: Response) => {
  const courses = await courseModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    courses,
  });
};
