import { User } from './user';
import { ThemeResponse } from './theme';

export interface Assignment {
  id: string;
  title: string;
  due_date: string;
  status: string;
}

export interface ClassroomDetails {
  name: string;
  description: string;
  student_count: number;
  assignments: Assignment[];
}

export interface CreateAssignmentRequest {
  classroom_id: string;
  motivational_content_id: string;
  due_date: string;
  description?: string;
}

export interface CreateAssignmentResponse {
  id: string;
  title: string;
  due_date: string;
  classroom_id: string;
  motivational_content_id: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  user: User;
  submitted_at: string;
  grade: number;
  essay_id: string;
}

export interface AssignmentDetails {
  id: string;
  description: string | null;
  due_date: string;
  motivational_content: ThemeResponse;
  submissions_count: number;
  students_count: number;
  submissions: Submission[];
}

export interface AssignmentDetailsForStudent {
  title: string;
  description: string;
  motivational_content: ThemeResponse;
  due_date: string;
  assignment_status: string;
  essay_id: string;
}

export interface ClassroomDetailsForStudent {
  name: string;
  student_count: number;
  description: string;
  teacher_name: string;
  assignments: Assignment[];
}

export interface Classroom {
  id: string;
  name: string;
  description: string;
  shift: string;
  join_code: string;
  school_id: string;
  teacher_id: string;
}

export interface School {
  id: string;
  name: string;
  image_url?: string;
}

export interface SchoolWithClassrooms extends School {
  classrooms: Classroom[];
}

export interface JoinClassroomResponse {
  status: string;
}