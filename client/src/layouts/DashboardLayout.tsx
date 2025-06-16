import React, { useState, memo } from "react";
import SidebarDashboard from "../components/dashboard/SidebarDashboard";
import HeaderDashboard from "../components/dashboard/HeaderDashboard";

interface UserInfo {
  name: string;
  role: string;
  email?: string;
  avatar?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "student" | "teacher";
  name: string;
  menu: {
    label: string;
    icon: React.ReactNode;
    active?: boolean;
    badge?: number;
    to?: string;
    submenu?: any[];
    onClick?: () => void;
  }[];
  avatar?: string;
  userInfo?: UserInfo;
}

// Memoize Header component
const MemoizedHeader = memo(HeaderDashboard);

// Memoize Sidebar component
const MemoizedSidebar = memo(SidebarDashboard);

// Memoize the main content wrapper
const ContentWrapper = memo<{ children: React.ReactNode }>(({ children }) => (
  <div className="flex-1">{children}</div>
));

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  role,
  name,
  menu,
  avatar,
  userInfo,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Memoize the toggle sidebar handler
  const handleToggleSidebar = React.useCallback(() => {
    setSidebarOpen((v) => !v);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-row">
      <div className={sidebarOpen ? "w-72" : "w-20"}>
        <MemoizedSidebar
          role={role}
          name={name}
          menu={menu}
          open={sidebarOpen}
          avatar={avatar}
          userInfo={userInfo}
        />
      </div>
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">
        <div className="sticky top-0 z-30 bg-white shadow">
          <MemoizedHeader
            name={name}
            role={role}
            onToggleSidebar={handleToggleSidebar}
            sidebarOpen={sidebarOpen}
            avatar={avatar}
            userInfo={userInfo}
          />
        </div>
        <ContentWrapper>{children}</ContentWrapper>
      </div>
    </div>
  );
};

// Memoize the entire DashboardLayout
export default memo(DashboardLayout);
