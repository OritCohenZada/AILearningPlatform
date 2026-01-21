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

  userForm: FormGroup;      
  learningForm: FormGroup; 

 
  users: User[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  history: Prompt[] = [];


  selectedUser: User | null = null;
  isLoading: boolean = false;
  currentResponse: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required]
    });


    this.learningForm = this.fb.group({
      category: ['', Validators.required],
      subCategory: ['', Validators.required],
      prompt: ['', [Validators.required, Validators.minLength(5)]]
    });
  }
ngOnInit(): void {

    const savedUser = localStorage.getItem('currentUser');

    if (savedUser) {
      this.selectedUser = JSON.parse(savedUser);
      
      if (this.selectedUser?.id) {
        this.apiService.getUserHistory(this.selectedUser.id).subscribe({
          next: (data) => this.history = data,
          error: (err) => console.error('Failed to load history', err)
        });
      }

      this.loadCategories(); 

    } else {
      this.router.navigate(['/login']);
    }
  }
  
  // loadInitialData(): void {

  //   this.apiService.getUsers().subscribe({
  //     next: (data) => this.users = data,
  //     error: (err) => console.error('Failed to load users', err)
  //   });

 
  //   this.apiService.getCategories().subscribe({
  //     next: (data) => this.categories = data,
  //     error: (err) => console.error('Failed to load categories', err)
  //   });
  // }


  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.subCategories = []; 
      },
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  
  selectUser(user: User): void {
    this.selectedUser = user;
    this.loadUserHistory(user.id!);
  }

  createNewUser(): void {
    if (this.userForm.invalid) return;

    const { name, phone } = this.userForm.value;
    this.isLoading = true;

    this.apiService.createUser(name, phone).subscribe({
      next: (newUser) => {
        this.users.push(newUser); 
        this.selectUser(newUser); 
        this.userForm.reset();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to create user', err);
        this.isLoading = false;
        alert('Error creating user. Phone might be taken.');
      }
    });
  }

  loadUserHistory(userId: number): void {
    this.apiService.getUserHistory(userId).subscribe({
      next: (data) => this.history = data,
      error: (err) => console.error('Failed to load history', err)
    });
  }


  onCategoryChange(): void {

    const categoryId = this.learningForm.get('category')?.value;
    if (!categoryId) return;

    this.subCategories = []; 
    this.apiService.getSubCategories(categoryId).subscribe({
      next: (data) => this.subCategories = data
    });
  }

  submitPrompt(): void {
    if (this.learningForm.invalid || !this.selectedUser) return;

    this.isLoading = true;
    this.currentResponse = null;

    const request = {
      user_id: this.selectedUser.id!,
      category_id: this.learningForm.value.category,
      sub_category_id: this.learningForm.value.subCategory,
      prompt: this.learningForm.value.prompt
    };

    this.apiService.createPrompt(request).subscribe({
      next: (res) => {
        this.currentResponse = res.response;
        this.history.unshift(res); 
        this.isLoading = false;
        this.learningForm.controls['prompt'].reset();
      },
      error: (err) => {
        console.error('Error generating lesson', err);
        this.isLoading = false;
        alert('Something went wrong with the AI service.');
      }

      
    });
  }

 
  logout(): void {
  localStorage.removeItem('currentUser'); 
    this.router.navigate(['/login']);
  }
}