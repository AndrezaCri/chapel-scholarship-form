export interface Question {
  id: string;
  text: string;
  type: 'text' | 'radio' | 'textarea';
  required?: boolean;
  maxLength?: number;
}

export interface TitleConfig {
  formTitle: string;
  formSubtitle: string;
  cardTitle: string;
  essayTitle: string;
  essayQuestion: string;
  editorTitle: string;
  editorSubtitle: string;
}