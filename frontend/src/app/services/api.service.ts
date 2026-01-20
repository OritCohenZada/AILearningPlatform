import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category, SubCategory } from '../models/category.model';
import { Prompt, CreatePromptRequest } from '../models/prompt.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  createUser(name: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, { name });
  }

 
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }


  getSubCategories(): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${this.baseUrl}/sub_categories`);
  }


  
  createPrompt(request: CreatePromptRequest): Observable<Prompt> {
    return this.http.post<Prompt>(`${this.baseUrl}/prompts`, request);
  }


  getPromptsHistory(userId?: number): Observable<Prompt[]> {
    let params = new HttpParams();
    if (userId) {
      params = params.set('user_id', userId);
    }
    
  
    return this.http.get<Prompt[]>(`${this.baseUrl}/prompts`, { params });
  }
}