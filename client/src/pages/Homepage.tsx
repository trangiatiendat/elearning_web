import Banner from "../components/Banner";
import CategoryList from "../components/CategoryList";
import CourseCard from "../components/CourseCard";
import HomeLayout from "../layouts/HomeLayout";
import { useEffect, useState } from "react";

const courses = [
  {
    title: "React Cơ Bản",
    description:
      "Học cách xây dựng ứng dụng web với React từ cơ bản đến nâng cao.",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "NodeJS & Express",
    description: "Xây dựng backend API mạnh mẽ với NodeJS và Express.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "UI/UX Design",
    description:
      "Nắm vững các nguyên tắc thiết kế giao diện người dùng hiện đại.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
];

const visibleCount = 3;

const Homepage = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (courses.length <= visibleCount) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % courses.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getVisibleCourses = () => {
    const result = [];
    for (let i = 0; i < visibleCount; i++) {
      result.push(courses[(current + i) % courses.length]);
    }
    return result;
  };

  return (
    <HomeLayout>
      <div className="bg-gray-100 font-sans">
        <main className="max-w-6xl mx-auto pt-[95px] px-2">
          <section className="flex flex-col md:flex-row items-center justify-between mb-4 gap-6 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 shadow-lg px-4 md:px-12 py-6 md:py-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent tracking-wide mb-2">
                Chào mừng bạn đến với E-Learning
              </h1>
              <p className="text-gray-700 text-lg font-medium">
                Nền tảng học tập trực tuyến hiện đại, kết nối bạn với hàng ngàn
                khoá học chất lượng từ các chuyên gia hàng đầu.
              </p>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-pink-500">
                  10,000+
                </div>
                <div className="text-gray-600 font-bold">Học viên</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-purple-700">
                  120+
                </div>
                <div className="text-gray-600 font-bold">Khoá học</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold text-green-500">
                  30+
                </div>
                <div className="text-gray-600 font-bold">Chuyên gia</div>
              </div>
            </div>
          </section>
          <Banner />
          <CategoryList />
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2 bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent tracking-wide">
            Khóa học nổi bật
          </h2>
          <section className="flex flex-col items-center">
            <div className="flex justify-center items-center gap-6 w-full">
              {getVisibleCourses().map((course, idx) => (
                <div
                  key={course.title}
                  className="w-full md:w-[340px] max-w-full transition-all duration-300"
                >
                  <CourseCard {...course} hot={current === 0 && idx === 0} />
                </div>
              ))}
            </div>
            {/* Pagination dots */}
            <div className="flex justify-center mt-2 gap-2">
              {courses.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 shadow ${
                    idx === current
                      ? "bg-gradient-to-r from-purple-600 to-cyan-400 shadow-md"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Chọn nhóm ${idx + 1}`}
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </HomeLayout>
  );
};

export default Homepage;
