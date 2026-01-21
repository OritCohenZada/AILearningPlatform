import { Prompt } from './prompt.model';

export interface User {
  id?: number; 
  name: string;
  phone: string;

  prompts?: Prompt[];
}