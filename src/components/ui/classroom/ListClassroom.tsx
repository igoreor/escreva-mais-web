'use client';
import React from 'react';
import Link from 'next/link';
import { FiUsers } from 'react-icons/fi';

interface Student {
  id: string;
  name: string;
}

interface ListClassroomProps {
  classroomName: string;
  studentCount: number;
  teacherName: string;
  students: Student[];
  onBack?: () => void; // ação do botão voltar (professor → painel, aluno → dashboard)
  backHref?: string; // Link para navegação usando Next.js Link
}

const ListClassroom: React.FC<ListClassroomProps> = ({
  classroomName,
  studentCount,
  teacherName,
  students,
  onBack,
  backHref,
}) => {
  return (
    <main className="ml-0 lg:ml-[270px] w-full max-h-screen overflow-y-auto p-6 lg:p-12">
      {/* header */}
      <div className="flex justify-between items-center bg-blue-50 p-6 rounded-lg mb-6">
        <div className="flex items-center gap-3">
          {backHref ? (
            <Link href={backHref} className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg">
              ←
            </Link>
          ) : (
            <button onClick={onBack} className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg">
              ←
            </button>
          )}
          <h1 className="text-2xl font-semibold text-blue-900 flex items-center gap-2">
            🎓 {classroomName}
          </h1>
        </div>
        <div className="flex items-center text-gray-700 text-sm gap-2">
          <FiUsers /> {studentCount} alunos
        </div>
      </div>

      {/* professor */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-8">
        <h2 className="font-semibold text-gray-700 mb-2">Professor</h2>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
            {teacherName.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-800">{teacherName}</span>
        </div>
      </div>

      {/* list alunos */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="font-semibold text-gray-700 mb-4">Alunos ({students.length})</h2>
        <ul className="divide-y divide-gray-200">
          {students.map((student) => (
            <li key={student.id} className="flex items-center gap-3 py-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                {student.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-800">{student.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};

export default ListClassroom;
