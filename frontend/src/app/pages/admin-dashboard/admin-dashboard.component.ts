import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { Prompt } from '../../models/prompt.model';
import { Category } from '../../models/category.model';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

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
  

  showUserModal: boolean = false;
  showCategoryModal: boolean = false;
  
 
  showDeleteModal: boolean = false;
  deleteType: 'user' | 'category' | 'sub-category' | null = null;
  itemToDelete: any = null; 

  isEditing: boolean = false;
  editingUserId: number | null = null;
  userForm: FormGroup;
  
  modalType: 'category' | 'sub-category' = 'category';
  editingContentId: number | null = null;
  parentIdForSub: number | null = null;
  contentForm: FormGroup;

  private toast = inject(ToastService);
  private apiService = inject(ApiService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  constructor() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required]
    });

    this.contentForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  currentSkip: number = 0; 
  limit: number = 5;

  ngOnInit(): void {
    this.loadUsers();
    this.loadCategories();
  }

loadUsers(): void {
    this.apiService.getUsers(this.currentSkip, this.limit).subscribe(data => {
      this.users = data.filter(user => user.role !== 'admin');
    });
  }
  nextPage(): void {
    if (this.users.length === this.limit) {
      this.currentSkip += this.limit;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.currentSkip > 0) {
      this.currentSkip -= this.limit;
      this.loadUsers();
    }
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

    const action = this.isEditing && this.editingUserId 
      ? this.apiService.updateUser(this.editingUserId, name, phone)
      : this.apiService.createUser(name, phone);

    action.subscribe({
      next: () => {
        this.toast.success(this.isEditing ? 'User updated!' : 'User created!');
        this.loadUsers();
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        this.toast.error(this.isEditing ? 'Failed to update user' : 'Failed to create user');
      }
    });
  }

  deleteUser(user: User, event: Event): void {
    event.stopPropagation();
    this.itemToDelete = user;
    this.deleteType = 'user';
    this.showDeleteModal = true;
  }

  deleteCategory(id: number): void {
    this.itemToDelete = id;
    this.deleteType = 'category';
    this.showDeleteModal = true;
  }


  deleteSubCategory(id: number): void {
    this.itemToDelete = id;
    this.deleteType = 'sub-category';
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.itemToDelete || !this.deleteType) return;

    if (this.deleteType === 'user') {
      const user = this.itemToDelete as User;
      this.apiService.deleteUser(user.id!).subscribe({
        next: () => {
          this.toast.success('User deleted successfully');
          this.loadUsers();
          if (this.selectedUser?.id === user.id) this.selectedUser = null;
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Failed to delete user');
        }
      });
    } 
    else if (this.deleteType === 'category') {
      this.apiService.deleteCategory(this.itemToDelete).subscribe({
        next: () => {
          this.toast.success('Category deleted');
          this.loadCategories();
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Failed to delete category');
        }
      });
    } 
    else if (this.deleteType === 'sub-category') {
      this.apiService.deleteSubCategory(this.itemToDelete).subscribe({
        next: () => {
          this.toast.success('Sub-category deleted');
          this.loadCategories();
          this.closeDeleteModal();
        },
        error: (err) => {
          console.error(err);
          this.toast.error('Failed to delete sub-category');
        }
      });
    }
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
    this.deleteType = null;
  }


  closeModal(): void {
    this.showUserModal = false;
    this.showCategoryModal = false;
  }
  
  logout(): void {
    this.router.navigate(['/login']);
  }

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
  openEditSubCategoryModal(sub: any, categoryId: number): void {
    this.modalType = 'sub-category';
    this.isEditing = true;
    this.editingContentId = sub.id;
    this.parentIdForSub = categoryId; 
    this.contentForm.patchValue({ name: sub.name });
    this.showCategoryModal = true;
  }

  openEditContentModal(item: any): void {
    this.modalType = 'category';
    this.isEditing = true;
    this.editingContentId = item.id;
    this.contentForm.patchValue({ name: item.name });
    this.showCategoryModal = true;
  }

  finishContentAction(): void {
    this.loadCategories();      
    this.showCategoryModal = false; 
    this.isEditing = false;     
    this.editingContentId = null; 
    this.parentIdForSub = null; 
    this.contentForm.reset();   
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  }

  getSubCategoryName(subCategoryId: number): string {
    for (const category of this.categories) {
      const subCategory = category.sub_categories?.find(sub => sub.id === subCategoryId);
      if (subCategory) {
        return subCategory.name;
      }
    }
    return 'Unknown Sub-Category';
  }

saveContent(): void {

    if (this.contentForm.invalid) return;
    
    const name = this.contentForm.value.name;
    let request;


    if (this.modalType === 'category') {
      request = this.isEditing && this.editingContentId
        ? this.apiService.updateCategory(this.editingContentId, name)
        : this.apiService.createCategory(name);
    } 
    

    else if (this.modalType === 'sub-category') {
      
      if (this.isEditing && this.editingContentId) {
         request = this.apiService.updateSubCategory(this.editingContentId, name);
      } else if (this.parentIdForSub) {
         request = this.apiService.createSubCategory(this.parentIdForSub, name);
      }
    }


    request?.subscribe({
      next: () => {
        this.toast.success('Content saved successfully');
        this.finishContentAction();
      },
      error: (err) => {
        console.error(err);
        const action = this.isEditing ? 'update' : 'create';
        const type = this.modalType === 'category' ? 'category' : 'sub-category';
        this.toast.error(`Failed to ${action} ${type}`);
      }
    });
  }
}