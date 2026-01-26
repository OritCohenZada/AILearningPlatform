import { Prompt } from './prompt.model';

export interface User {
  id?: number; 
  name: string;
  phone: string;
  role: string;

  prompts?: Prompt[];
}