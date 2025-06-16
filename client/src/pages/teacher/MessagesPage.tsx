import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useTeacherMenu } from "../../components/teacher/menuTeacher";
import useTeacher from "../../hooks/useTeacher";

const MessagesPage: React.FC = () => {
  const menu = useTeacherMenu();
  const { teacher, loading } = useTeacher();

  const displayName = loading ? "Giáo viên" : teacher?.name || "Giáo viên";

  return (
    <DashboardLayout
      role="teacher"
      name={displayName}
      menu={menu}
      avatar={teacher?.avatar}
      userInfo={{
        name: displayName,
        role: "Giáo viên",
        email: teacher?.email,
        avatar: teacher?.avatar,
      }}
    >
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Tin nhắn</h1>
          <p className="text-gray-600 mt-1">Trao đổi với học sinh</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex h-[calc(100vh-280px)]">
            {/* Contacts list */}
            <div className="w-1/3 border-r border-gray-200">
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Tìm kiếm tin nhắn..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="overflow-y-auto h-[calc(100%-80px)]">
                {/* Contact Item */}
                <div className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium">
                      NT
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          Nguyễn Thành
                        </h3>
                        <span className="text-xs text-gray-500">10:30</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        Thầy ơi, em có thắc mắc về bài tập...
                      </p>
                    </div>
                  </div>
                </div>
                {/* Add more contact items here */}
              </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium">
                    NT
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Nguyễn Thành
                    </h3>
                    <p className="text-xs text-gray-500">Đang hoạt động</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Message bubble */}
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-[70%]">
                    <p className="text-sm text-gray-800">
                      Thầy ơi, em có thắc mắc về bài tập React Components ạ.
                    </p>
                    <span className="text-xs text-gray-500 mt-1">10:30</span>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-green-100 rounded-lg px-4 py-2 max-w-[70%]">
                    <p className="text-sm text-gray-800">
                      Em cứ nêu thắc mắc, thầy sẽ giải đáp.
                    </p>
                    <span className="text-xs text-gray-500 mt-1">10:31</span>
                  </div>
                </div>
                {/* Add more messages here */}
              </div>

              {/* Message input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Gửi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
