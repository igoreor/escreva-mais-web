export interface ThemePayload {
  theme: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
}

export interface ThemeUpdatePayload {
  new_theme?: string;
  new_text1?: string;
  new_text2?: string;
  new_text3?: string;
  new_text4?: string;
}

export interface ThemeResponse {
  id: string;
  theme: string;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  created_at: string;
  creator_id: string;
}

export interface ThemesListResponse {
  items: ThemeResponse[];
  total: number;
  page: number;
  limit: number;
}

export interface Theme {
  id: string;
  theme: string;
}

export interface Tema {
  id: string | number;
  titulo: string;
  criado: string;
  textos: string[];
}

export interface ThemesApiData {
  items: ThemeResponse[];
}
