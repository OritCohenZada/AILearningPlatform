export interface Prompt {
  id: number;
  user_id: number;
  category_id: number;
  sub_category_id: number;
  prompt: string;     
  response: string;    
  created_at: string;   
}


export interface CreatePromptRequest {
  user_id: number;
  category_id: number;
  sub_category_id: number;
  prompt: string;
}