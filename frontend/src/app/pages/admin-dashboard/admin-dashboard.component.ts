import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { Prompt } from '../../models/prompt.model';
import { Category, SubCategory } from '../../models/category.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {


  activeTab: 'users' | 'content' = 'users'; 

 
  users: User[] = [];
  selectedUser: User | null = null;
  userHistory: Prompt[] = [];
  isLoadingUsers: boolean = false;


  categories: Category[] = [];
  
 
  categoryForm: FormGroup;
  subCategoryForm: FormGroup;

  constructor(private apiService: ApiService, private fb: FormBuilder) {

    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });

  
    this.subCategoryForm = this.fb.group({
      parentId: ['', Validators.required],
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadCategories();
  }


  loadUsers(): void {
    this.apiService.getUsers().subscribe(data => this.users = data);
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe(data => this.categories = data);
  }


  selectUser(user: User): void {
    this.selectedUser = user;
    this.isLoadingUsers = true;
    this.userHistory = [];
    
    if (user.id) {
      this.apiService.getUserHistory(user.id).subscribe({
        next: (data) => {
          this.userHistory = data;
          this.isLoadingUsers = false;
        },
        error: () => this.isLoadingUsers = false
      });
    }
  }

  addCategory(): void {
    if (this.categoryForm.invalid) return;
    const name = this.categoryForm.value.name;

    this.apiService.createCategory(name).subscribe(newCat => {
      this.categories.push(newCat); 
      this.categoryForm.reset();
      alert('קטגוריה נוספה בהצלחה! ✅');
    });
  }


  addSubCategory(): void {
    if (this.subCategoryForm.invalid) return;
    const { parentId, name } = this.subCategoryForm.value;

    this.apiService.createSubCategory(parentId, name).subscribe(() => {
      this.subCategoryForm.controls['name'].reset();
      alert('תת-קטגוריה נוספה בהצלחה! ✅');
    });
  }
}