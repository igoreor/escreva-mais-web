import { User } from './user';
import { ThemeResponse } from './theme';
import { Submission } from './classroom';

export interface AssignmentDetailsResponse {
  id: string;
  description: string;
  due_date: string;
  motivational_content: ThemeResponse;
  submissions_count: number;
  students_count: number;
  submissions: Submission[];
}

export interface EvaluationPoint {
  id: string;
  essay_feedback_id?: string;
  competency_feedback_id?: string;
  is_strength: boolean;
  comment: string;
}

export interface CompetencyFeedback {
  id: string;
  competency: string;
  essay_feedback_id: string;
  score: number;
  feedback: string;
  evaluation_points: EvaluationPoint[];
}

export interface EssayDetailsForTeacherResponse {
  essay_id: string;
  student: User;
  title: string;
  content: string;
  image_url?: string;
  general_feedback: string;
  evaluation_points: EvaluationPoint[];
  competency_feedbacks: CompetencyFeedback[];
}

export interface UpdateEssayFeedbackRequest {
  general_feedback: string;
}

export interface UpdateEssayFeedbackResponse {
  status: string;
}

export interface CreateEssayRequest {
  assignment_id: string;
  title?: string;
  content?: string;
  image?: File;
}

export interface CreateEssayResponse {
  id: string;
  assignment_id: string;
  author_id: string;
  title: string;
  theme: string;
  image_key?: string;
  image_url?: string;
  content: string;
  created_at: string;
}

export interface EssayWithStatus {
  id: string;
  title: string;
  theme: string;
  is_draft: boolean;
  status: string;
  created_at: string;
}

export interface Competency {
  id: string;
  competency: string;
  score: number;
  feedback: string;
}

export interface StudentFeedbackDetails {
  total_score: number;
  best_competency: Competency;
  worst_competency: Competency;
  competencies: Competency[];
  teacher_comment: string;
  ai_strengths: string[];
  ai_weaknesses: string[];
}

export interface CreateStandAloneEssayRequest {
  theme: string;
  title?: string | null;
  content?: string | null;
  image?: File | null;
}

export interface EvaluateEssayResponse {
  status: string;
  message?: string;
  feedback_id?: string;
}

export interface EssayValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
