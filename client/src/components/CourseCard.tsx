interface CourseCardProps {
  title: string;
  description: string;
  image: string;
  hot?: boolean;
  active?: boolean;
}

const CourseCard = ({ title, description, image, hot }: CourseCardProps) => {
  return (
    <div className="max-w-[340px] rounded-2xl shadow-lg relative transition-all duration-200 hover:shadow-2xl hover:-translate-y-1.5 hover:scale-105 font-sans flex flex-col items-center">
      {hot && (
        <span className="absolute top-3.5 left-3.5 z-10 bg-gradient-to-r from-pink-500 to-pink-400 text-white px-3 py-1 text-sm font-bold rounded shadow-md">
          Hot
        </span>
      )}
      <img
        src={image}
        alt={title}
        className="w-full h-[170px] object-cover rounded-t-2xl"
      />
      <div className="w-full flex flex-col items-center text-center p-4">
        <h3 className="font-extrabold text-lg text-purple-700 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <button className="rounded-xl border-2 border-pink-400 text-pink-500 font-bold px-4 py-1.5 text-sm hover:bg-pink-50 transition-all">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
