import React from 'react';
import Image from 'next/image';

interface UserTypeSelectorProps {
  value: 'student' | 'teacher';
  onChange: (type: 'student' | 'teacher') => void;
}

const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="w-full bg-global-2 rounded-[5px] p-1.5 flex">
      <button
        onClick={() => onChange('student')}
        className={`
          flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded text-sm sm:text-base font-normal transition-all duration-200 
          rounded-[5px] text-base font-normal transition-all duration-200
          ${value === 'student' 
            ? 'bg-button-2 text-global-1 shadow-md' 
            : 'text-global-1 hover:bg-gray-200'
          }
        `}
      >
        <Image
          src="/images/img_person.svg"
          alt="Student"
          width={24}
          height={24}
          className="w-5 h-5 sm:w-6 sm:h-6"
        />
        <span>Sou Aluno</span>
      </button>
      <button
        onClick={() => onChange('teacher')}
        className={`
          flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded text-sm sm:text-base font-normal transition-all duration-200 
          rounded-[5px] text-base font-normal transition-all duration-200
          ${value === 'teacher' 
            ? 'bg-button-2 text-global-1 shadow-md' 
            : 'text-global-1 hover:bg-gray-200'
          }
        `}
      >
        <Image
          src="/images/img_school.svg"
          alt="Teacher"
          width={24}
          height={24}
          className="w-6 h-6"
        />
        <span>Sou Professor</span>
      </button>
    </div>
  );
};

export default UserTypeSelector;