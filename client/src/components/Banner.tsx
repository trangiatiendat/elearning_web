const Banner = () => (
  <div className="w-full min-h-[280px] flex items-center justify-center bg-gradient-to-tr from-purple-300 via-pink-200 to-pink-100 rounded-xl px-4 md:px-24 py-8 md:py-16 mb-8 shadow-lg gap-8 relative overflow-hidden flex-col md:flex-row font-sans">
    {/* Overlay */}
    <div className="absolute inset-0 bg-white/20 z-10" />
    {/* Text bên trái */}
    <div className="flex-1 z-20 flex flex-col items-center md:items-start justify-center text-center md:text-left order-1">
      <h2 className="text-3xl md:text-4xl font-extrabold text-purple-800 mb-2 leading-tight">
        Học tập dễ dàng, phát triển không giới hạn
      </h2>
      <p className="text-lg md:text-xl text-purple-900 mb-6 font-medium">
        Khám phá hàng ngàn khoá học chất lượng, cập nhật liên tục từ các chuyên
        gia hàng đầu. Bắt đầu hành trình phát triển bản thân ngay hôm nay!
      </p>
      <button className="font-extrabold rounded-2xl px-8 py-3 text-xl shadow-md bg-gradient-to-r from-pink-500 to-pink-400 text-white hover:from-pink-400 hover:to-pink-500 transition-all">
        Khám phá ngay
      </button>
    </div>
    {/* Hình minh hoạ bên phải */}
    <div className="flex-1 flex justify-center items-center z-20 order-2 h-[220px] md:h-auto">
      <img
        src="https://anhdephd.vn/wp-content/uploads/2022/04/anh-hoc-bai-co-laptop.jpg"
        alt="Online learning illustration"
        className="w-full h-full max-h-[380px] object-cover rounded-3xl shadow-xl bg-white p-0 block"
        loading="lazy"
      />
    </div>
  </div>
);

export default Banner;
