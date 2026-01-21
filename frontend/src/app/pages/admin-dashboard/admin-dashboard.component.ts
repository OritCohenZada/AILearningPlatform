import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { Prompt } from '../../models/prompt.model';
import { Category, SubCategory } from '../../models/category.model';
import { Router } from '@angular/router';

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
  
  // משתני מודל משתמשים
  showUserModal: boolean = false;
  isEditing: boolean = false;
  editingUserId: number | null = null;
  userForm: FormGroup;
  
  // משתני מודל קטגוריות (חדש)
  showCategoryModal: boolean = false;
  modalType: 'category' | 'sub-category' = 'category';
  editingContentId: number | null = null;
  parentIdForSub: number | null = null;
  contentForm: FormGroup; // טופס מאוחד

  constructor(
    private apiService: ApiService, 
    private fb: FormBuilder,
    private router: Router
  ) {
    // טופס משתמשים
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required]
    });

    // טופס תוכן מאוחד (במקום הפיצול שהיה)
    this.contentForm = this.fb.group({
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

  // --- לוגיקת משתמשים (ללא שינוי) ---

  openAddUserModal(): void {
    this.isEditing = false;
    this.editingUserId = null;
    this.userForm.reset();
    this.showUserModal = true;
  }

  openEditUserModal(user: User, event: Event): void {
    event.stopPropagation();
    this.isEditing = true;
    this.editingUserId = user.id!;
    this.userForm.patchValue({ name: user.name, phone: user.phone });
    this.showUserModal = true;
  }

  saveUser(): void {
    if (this.userForm.invalid) return;
    const { name, phone } = this.userForm.value;

    if (this.isEditing && this.editingUserId) {
      this.apiService.updateUser(this.editingUserId, name, phone).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    } else {
      this.apiService.createUser(name, phone).subscribe(() => {
        this.loadUsers();
        this.closeModal();
      });
    }
  }

  deleteUser(user: User, event: Event): void {
    event.stopPropagation();
    if (confirm(`למחוק את המשתמש ${user.name}?`)) {
      this.apiService.deleteUser(user.id!).subscribe(() => {
        this.loadUsers();
        if (this.selectedUser?.id === user.id) {
          this.selectedUser = null;
        }
      });
    }
  }

  closeModal(): void {
    this.showUserModal = false;
    this.showCategoryModal = false;
  }
  
  logout(): void {
    this.router.navigate(['/login']);
  }

  // --- לוגיקת קטגוריות החדשה ---

  openAddCategoryModal(): void {
    this.modalType = 'category';
    this.isEditing = false;
    this.editingContentId = null;
    this.contentForm.reset();
    this.showCategoryModal = true;
  }

  openAddSubCategoryModal(categoryId: number): void {
    this.modalType = 'sub-category';
    this.parentIdForSub = categoryId;
    this.isEditing = false;
    this.contentForm.reset();
    this.showCategoryModal = true;
  }

  openEditContentModal(item: any): void {
    this.modalType = 'category';
    this.isEditing = true;
    this.editingContentId = item.id;
    this.contentForm.patchValue({ name: item.name });
    this.showCategoryModal = true;
  }

  saveContent(): void {
    if (this.contentForm.invalid) return;
    const name = this.contentForm.value.name;

    if (this.modalType === 'category') {
      if (this.isEditing && this.editingContentId) {
        this.apiService.updateCategory(this.editingContentId, name).subscribe(() => this.finishContentAction());
      } else {
        this.apiService.createCategory(name).subscribe(() => this.finishContentAction());
      }
    } else {
      if (this.parentIdForSub) {
        this.apiService.createSubCategory(this.parentIdForSub, name).subscribe(() => this.finishContentAction());
      }
    }
  }

  deleteCategory(id: number): void {
    if(confirm('למחוק את הקטגוריה וכל התוכן שלה?')) {
      this.apiService.deleteCategory(id).subscribe(() => this.loadCategories());
    }
  }

  deleteSubCategory(id: number): void {
    if(confirm('למחוק את תת-הנושא?')) {
      this.apiService.deleteSubCategory(id).subscribe(() => this.loadCategories());
    }
  }

  finishContentAction(): void {
    this.loadCategories();
    this.showCategoryModal = false;
  }
}