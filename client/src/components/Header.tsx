import { Link as RouterLink } from "react-router-dom";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import MenuBookIcon from "@mui/icons-material/MenuBook";

type HeaderProps = {
  userType?: "student" | "teacher";
};

const Header = ({ userType }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur shadow-md transition-shadow font-sans">
      <div className="flex items-center min-h-[80px] px-4 md:px-16 gap-0">
        {/* Logo + slogan */}
        <div className="flex items-center gap-4 min-w-[210px] mr-10 cursor-pointer transition-transform hover:scale-105">
          <div className="bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full p-3 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
            <SchoolIcon style={{ fontSize: 34, color: "#fff" }} />
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-purple-600 to-cyan-400 bg-clip-text text-transparent leading-none transition-colors select-none">
              E-Learning
            </span>
            <span className="block text-cyan-400 font-semibold text-sm ml-1 tracking-wide">
              Học mọi lúc, mọi nơi
            </span>
          </div>
        </div>
        {/* Menu phụ + search */}
        <div className="flex-1 flex items-center justify-center gap-8">
          <div className="hidden md:flex items-center gap-6">
            <button className="flex items-center gap-2 font-bold text-lg px-4 min-h-[44px] rounded-xl relative transition-colors hover:text-purple-600 hover:bg-purple-100 after:block after:w-0 after:h-[3px] after:bg-gradient-to-r after:from-purple-600 after:to-cyan-400 after:rounded after:transition-all after:absolute after:left-0 after:-bottom-1 hover:after:w-full">
              <BusinessCenterIcon style={{ fontSize: 20 }} />
              Doanh nghiệp
            </button>
            <button className="flex items-center gap-2 font-bold text-lg px-4 min-h-[44px] rounded-xl relative transition-colors hover:text-cyan-400 hover:bg-cyan-50 after:block after:w-0 after:h-[3px] after:bg-gradient-to-r after:from-cyan-400 after:to-purple-600 after:rounded after:transition-all after:absolute after:left-0 after:-bottom-1 hover:after:w-full">
              <MenuBookIcon style={{ fontSize: 20 }} />
              Dạy học
            </button>
          </div>
          <div className="flex items-center min-w-[220px] max-w-[340px] w-full bg-gray-100 rounded-full px-4 shadow-sm focus-within:shadow-lg transition-shadow">
            <svg
              className="w-5 h-5 text-gradient-to-r from-purple-600 to-cyan-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="ml-3 flex-1 bg-transparent outline-none text-base font-medium text-gray-800 italic py-2"
              aria-label="search courses"
            />
          </div>
        </div>
        {/* Right menu */}
        <div className="flex items-center gap-6 ml-10 min-w-[140px] justify-end">
          <RouterLink to="/login">
            <button className="font-bold rounded-full px-6 text-base min-h-[44px] transition-colors bg-gray-100 hover:bg-purple-100 hover:text-purple-600">
              Đăng nhập
            </button>
          </RouterLink>
          <RouterLink to="/signup">
            <button className="font-bold rounded-full px-6 text-base min-h-[44px] shadow-md bg-gradient-to-r from-purple-600 to-cyan-400 text-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-600 transition-all">
              Đăng ký
            </button>
          </RouterLink>
          <div className="ml-3 w-9 h-9 flex items-center justify-center font-bold bg-white text-purple-600 border-2 border-purple-600 rounded-full shadow-sm text-base transition-transform hover:scale-110 hover:shadow-lg select-none">
            {userType ? (userType === "student" ? "S" : "G") : "A"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
