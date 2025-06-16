import React from "react";
import {
  MdNotifications,
  MdSearch,
  MdMenu,
  MdChevronLeft,
} from "react-icons/md";

interface UserInfo {
  name: string;
  role: string;
  email?: string;
  avatar?: string;
}

interface HeaderDashboardProps {
  name: string;
  role: "student" | "teacher";
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  avatar?: string;
  userInfo?: UserInfo;
}

const HeaderDashboard: React.FC<HeaderDashboardProps> = ({
  name,
  role,
  onToggleSidebar,
  sidebarOpen,
  avatar,
  userInfo,
}) => {
  return (
    <header
      className={`shadow-lg flex justify-between items-center px-8 py-5 border-b border-gray-100 w-full bg-white`}
    >
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-lg hover:bg-indigo-100 transition"
          onClick={onToggleSidebar}
        >
          {sidebarOpen ? (
            <MdChevronLeft className="text-gray-500 text-2xl" />
          ) : (
            <MdMenu className="text-gray-500 text-2xl" />
          )}
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight ml-2 drop-shadow-sm text-indigo-700">
          E-LEARNING
        </h1>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="px-5 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-gray-50 text-base shadow-sm min-w-[220px] pr-10"
          />
          <MdSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 text-xl" />
        </div>
        <button className="relative w-12 h-12 rounded-xl bg-gray-100 hover:bg-indigo-100 flex items-center justify-center shadow transition-all group">
          <MdNotifications className="text-2xl text-gray-600 group-hover:text-indigo-600 transition" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="relative group">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-12 h-12 rounded-xl object-cover shadow cursor-pointer"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow text-xl font-bold cursor-pointer select-none transition-all duration-200 border-2 border-transparent group-hover:border-indigo-400 bg-indigo-200 text-indigo-700"
              tabIndex={0}
            >
              {name.charAt(0)}
            </div>
          )}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50 border border-gray-100">
            <div className="px-4 py-2">
              <div className="font-semibold text-gray-800">{name}</div>
              <div className="text-xs text-gray-500 capitalize">
                {userInfo?.role || role}
              </div>
              {userInfo?.email && (
                <div className="text-xs text-gray-500 truncate">
                  {userInfo.email}
                </div>
              )}
            </div>
            <hr className="my-1 border-gray-200" />
            <button className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition">
              Profile
            </button>
            <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;
