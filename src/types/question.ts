export interface Question {
  id: string;
  text: string;
  type: 'text' | 'radio' | 'textarea';
  required?: boolean;
  maxLength?: number;
}