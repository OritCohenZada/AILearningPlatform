import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  createUser(name: string, phone: string): Observable<User> {

    return this.http.post<User>(`${this.baseUrl}/users`, { name, phone });
  }

 
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getSubCategories(categoryId: number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${this.baseUrl}/categories/${categoryId}/sub-categories`);
  }

  createPrompt(request: CreatePromptRequest): Observable<Prompt> {
    return this.http.post<Prompt>(`${this.baseUrl}/prompts/`, request);
  }

  getUserHistory(userId: number): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(`${this.baseUrl}/prompts/user/${userId}`);
  }
}