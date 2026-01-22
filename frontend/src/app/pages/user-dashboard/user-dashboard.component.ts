import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category, SubCategory } from '../../models/category.model';
import { User } from '../../models/user.model';
import { Prompt } from '../../models/prompt.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-dashboard.component.html',
})
export class UserDashboardComponent implements OnInit {

  learningForm: FormGroup; 
  

  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  history: Prompt[] = [];


  selectedUser: User | null = null;
  isLoading: boolean = false;
  currentResponse: string | null = null;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {

    this.learningForm = this.fb.group({
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      prompt: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {

    this.getUserDetails();
    
    this.loadCategories(); 
  }

  getUserDetails() {
    this.apiService.getCurrentUser().subscribe({
      next: (user) => {
        this.selectedUser = user;
        

        if (user.id) {
            this.loadUserHistory(user.id);
        }
      },
      error: (err) => {
        console.error("לא נמצא משתמש מחובר", err);
        this.logout();
      }
    });
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.subCategories = []; 
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadUserHistory(userId: number): void {
    this.apiService.getUserHistory(userId).subscribe({
      next: (data) => this.history = data.reverse(), 
      error: (err) => console.error('Failed to load history', err)
    });
  }

  onCategoryChange(): void {
    const categoryId = this.learningForm.get('category')?.value;
    if (!categoryId) return;

    this.subCategories = []; 
    this.learningForm.patchValue({ subCategory: '' });

    this.apiService.getSubCategories(categoryId).subscribe({
      next: (data) => this.subCategories = data,
      error: (err) => console.error(err)
    });
  }

 submitPrompt(): void {
  
    if (this.learningForm.invalid || !this.selectedUser) return;

    this.isLoading = true;
    this.currentResponse = null;
    this.errorMessage = '';

    const formValues = this.learningForm.value;


    const userId = this.selectedUser.id!; 

    const request = {
      user_id: userId,
      category_id: Number(formValues.category),
      sub_category_id: Number(formValues.subCategory),
      prompt: formValues.prompt
    };

    this.apiService.createPrompt(request).subscribe({
      next: (res) => {
        this.currentResponse = res.response;
        
 
        this.loadUserHistory(userId); 
        
        this.isLoading = false;
        this.learningForm.patchValue({ prompt: '' });
      },
      error: (err) => {
        console.error('Error generating lesson', err);
        this.isLoading = false;
        this.errorMessage = 'שגיאה בקבלת תשובה מה-AI. נסה שוב.';
      }
    });
  }
   

  logout(): void {
    this.apiService.logout(); 
    this.router.navigate(['/login']);
  }
}