import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; 
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

 

  getUsers(skip: number = 0, limit: number = 100): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?skip=${skip}&limit=${limit}`);
  }


  createUser(name: string, phone: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users/signup`, { name, phone });
  }

 
  login(name: string, phone: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/login`, { name, phone }).pipe(
      tap(response => {
        if (response && response.access_token) {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('user_role', response.user_role);
          localStorage.setItem('user_name', response.user_name);
        }
      })
    );
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
  }

 
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }


  isAdmin(): boolean {
    return localStorage.getItem('user_role') === 'admin';
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  updateUser(id: number, name: string, phone: string): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, { name, phone });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/me`);
  }

 

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getSubCategories(categoryId: number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(`${this.baseUrl}/categories/${categoryId}/sub-categories`);
  }

  createCategory(name: string): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories/`, { name });
  }

  createSubCategory(categoryId: number, name: string): Observable<SubCategory> {
    return this.http.post<SubCategory>(`${this.baseUrl}/categories/${categoryId}/sub-categories`, { name });
  }


  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/${id}`);
  }

  updateCategory(id: number, name: string): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/categories/${id}`, { name });
  }


  updateSubCategory(id: number, name: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/categories/sub-categories/${id}`, { name });
  }

  deleteSubCategory(subId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/categories/sub-categories/${subId}`);
  }


  createPrompt(request: CreatePromptRequest): Observable<Prompt> {
    return this.http.post<Prompt>(`${this.baseUrl}/prompts/`, request);
  }

  getUserHistory(userId: number): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(`${this.baseUrl}/prompts/user/${userId}`);
  }

  sendContactMessage(name: string, email: string, message: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/contact`, { name, email, message });
  }
}