import React, { useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  to?: string;
  active?: boolean;
  badge?: number;
  submenu?: MenuItem[];
  onClick?: () => void;
}

interface UserInfo {
  name: string;
  role: string;
  email?: string;
  avatar?: string;
}

interface SidebarDashboardProps {
  role: "student" | "teacher";
  name: string;
  menu: MenuItem[];
  open: boolean;
  avatar?: string;
  userInfo?: UserInfo;
}

const UserProfileSection = memo<{
  open: boolean;
  role: "student" | "teacher";
  name: string;
  avatar?: string;
  userInfo?: UserInfo;
}>(({ open, role, name, avatar, userInfo }) => {
  return (
    <>
      <div
        className={`flex transition-all duration-300 ${
          open
            ? "flex-row items-center mb-4 mt-[-8px] justify-start h-14"
            : "flex-col items-center justify-center mb-0 mt-0 h-20"
        }`}
        style={{ height: open ? 56 : 80 }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className={`rounded-lg shadow object-cover ${
              open ? "w-14 h-14" : "w-12 h-12"
            }`}
          />
        ) : (
          <div
            className={`rounded-lg flex items-center justify-center shadow text-lg font-bold select-none transition-all duration-200 ${
              open ? "w-14 h-14" : "w-12 h-12"
            } ${
              role === "student"
                ? "bg-indigo-200 text-indigo-700"
                : "bg-green-200 text-green-700"
            }`}
            title={name}
          >
            {name.charAt(0)}
          </div>
        )}
        {open && (
          <div className="ml-3 transition-all duration-300">
            <div
              className={`font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis ${
                role === "student" ? "text-gray-900" : "text-gray-800"
              }`}
              style={{ maxWidth: 170 }}
              title={name}
            >
              {name}
            </div>
            <div
              className={`text-base font-semibold capitalize ${
                role === "student" ? "text-gray-700" : "text-gray-700"
              }`}
            >
              {userInfo?.role ||
                (role === "student" ? "Học sinh" : "Giáo viên")}
            </div>
          </div>
        )}
      </div>
      {open && <hr className="border-t-2 border-gray-100 w-full mb-2" />}
    </>
  );
});

const MenuItem: React.FC<{
  item: MenuItem;
  open: boolean;
  role: "student" | "teacher";
  level?: number;
}> = ({ item, open, role, level = 0 }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(item.active);
  const navigate = useNavigate();

  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const paddingLeft = level * 12;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasSubmenu) {
      setIsSubmenuOpen(!isSubmenuOpen);
    }
    if (item.to && !hasSubmenu) {
      navigate(item.to, { replace: true }); // Use replace to prevent history stack growth
    }
  };

  return (
    <>
      <Link
        to={item.to || "#"}
        className={`flex items-center rounded-xl transition-all text-base font-bold group relative ${
          open ? "justify-start gap-3 px-4 py-3" : "justify-center w-14 h-14"
        } ${
          item.active
            ? role === "student"
              ? "bg-indigo-100 text-indigo-700 font-bold"
              : "bg-green-50 text-green-700 font-bold"
            : role === "student"
            ? "text-gray-900 hover:bg-indigo-50 hover:text-indigo-700 font-bold"
            : "text-gray-600 hover:bg-gray-100 hover:text-green-600"
        }`}
        onClick={handleClick}
        style={{ paddingLeft: open ? paddingLeft + 16 : undefined }}
      >
        <span
          className={`text-xl flex-shrink-0 ${
            role === "student" ? "text-indigo-700 font-bold" : ""
          }`}
        >
          {item.icon}
        </span>
        <span
          className={`transition-all duration-300 ${
            open ? "opacity-100 ml-2 w-auto" : "opacity-0 w-0 overflow-hidden"
          }`}
        >
          {item.label}
        </span>
        {hasSubmenu && open && (
          <ChevronDownIcon
            className={`h-5 w-5 ml-auto transition-transform duration-200 ${
              isSubmenuOpen ? "transform rotate-180" : ""
            }`}
          />
        )}
        {item.badge && (
          <span
            className={`transition-all duration-300 ${
              open ? "ml-auto opacity-100" : "opacity-0 w-0 overflow-hidden"
            } bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-semibold`}
          >
            {item.badge}
          </span>
        )}
      </Link>
      {hasSubmenu && open && isSubmenuOpen && (
        <div className="ml-4">
          {item.submenu?.map((subItem) => (
            <MenuItem
              key={subItem.label}
              item={subItem}
              open={open}
              role={role}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </>
  );
};

const SidebarDashboard: React.FC<SidebarDashboardProps> = ({
  role,
  name,
  menu,
  open,
  avatar,
  userInfo,
}) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("teacher_profile");
    navigate("/login");
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen shadow-xl flex flex-col justify-between rounded-none transition-all duration-300 z-30 ${
        open ? "w-72 px-8 py-6" : "w-20 p-0"
      } ${role === "student" ? "bg-white" : "bg-white"}`}
    >
      <div className="relative">
        <UserProfileSection
          open={open}
          role={role}
          name={name}
          avatar={avatar}
          userInfo={userInfo}
        />
        {/* Menu */}
        <nav
          className={
            open ? "space-y-2" : "flex flex-col items-center space-y-2"
          }
        >
          {menu.map((item) => (
            <MenuItem key={item.label} item={item} open={open} role={role} />
          ))}
        </nav>
      </div>
      {/* Nút log out chỉ hiện khi mở, ẩn bằng opacity/w-0 khi đóng */}
      <button
        className={`mt-10 py-2 rounded-xl font-semibold w-full transition-all duration-300 ${
          open ? "opacity-100 h-auto" : "opacity-0 h-0 p-0 overflow-hidden"
        } ${
          role === "student"
            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            : "bg-green-100 text-green-700 hover:bg-green-200"
        }`}
        onClick={handleLogout}
      >
        Log out
      </button>
    </aside>
  );
};

export default SidebarDashboard;
