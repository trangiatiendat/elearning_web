import CourseCard from "../../CourseCard";

interface Course {
  title: string;
  description: string;
  image: string;
  hot?: boolean;
  active?: boolean;
}

interface CourseListProps {
  courses: Course[];
}

const CourseList = ({ courses }: CourseListProps) => {
  if (!courses.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16 text-gray-400">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
          alt="No courses"
          className="w-24 h-24 mb-4 opacity-60"
        />
        <div className="text-lg font-semibold">Chưa có khoá học nào!</div>
        <div className="text-sm">
          Hãy đăng ký hoặc chờ giáo viên thêm khoá học mới.
        </div>
      </div>
    );
  }
  return (
    <div className="w-full flex justify-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {courses.map((course, idx) => (
          <CourseCard key={idx} {...course} />
        ))}
      </div>
    </div>
  );
};

export default CourseList;
