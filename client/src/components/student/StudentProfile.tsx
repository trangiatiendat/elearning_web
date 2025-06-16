import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";

export interface StudentProfileProps {
  student: {
    name: string;
    email: string;
    avatar?: string;
    class?: string;
    school?: string;
    phone?: string;
    bio?: string;
  };
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-6">
          {student.avatar ? (
            <img
              src={student.avatar}
              alt={student.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
              <UserCircleIcon className="w-16 h-16 text-indigo-600" />
            </div>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-indigo-600 font-medium mt-1">Học sinh</p>
            {student.class && (
              <p className="text-gray-600 mt-2">Lớp: {student.class}</p>
            )}
            {student.school && (
              <p className="text-gray-600 mt-1">Trường: {student.school}</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
            <p className="text-gray-800">{student.email}</p>
          </div>
          {student.phone && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                Số điện thoại
              </h3>
              <p className="text-gray-800">{student.phone}</p>
            </div>
          )}
        </div>

        {student.bio && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Giới thiệu
            </h3>
            <p className="text-gray-700 whitespace-pre-line">{student.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
