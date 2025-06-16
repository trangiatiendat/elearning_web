import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface TeacherProfileProps {
  teacher: {
    name: string;
    email: string;
    avatar?: string;
    specialization?: string;
    phone?: string;
    bio?: string;
  };
}

const TeacherProfile: React.FC<TeacherProfileProps> = ({ teacher }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-6">
          {teacher.avatar ? (
            <img
              src={teacher.avatar}
              alt={teacher.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-green-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
              <UserCircleIcon className="w-16 h-16 text-green-600" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{teacher.name}</h2>
            <p className="text-green-600 font-medium mt-1">Giáo viên</p>
            {teacher.specialization && (
              <p className="text-gray-600 mt-2">{teacher.specialization}</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
            <p className="text-gray-800">{teacher.email}</p>
          </div>
          {teacher.phone && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Số điện thoại
              </h3>
              <p className="text-gray-800">{teacher.phone}</p>
            </div>
          )}
        </div>

        {teacher.bio && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Giới thiệu
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{teacher.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherProfile;
