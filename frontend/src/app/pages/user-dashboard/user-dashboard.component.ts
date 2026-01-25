// import { Component, OnInit, inject ,ViewChild, ElementRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ApiService } from '../../services/api.service';
// import { Category, SubCategory } from '../../models/category.model';
// import { User } from '../../models/user.model';
// import { Prompt } from '../../models/prompt.model';
// import { Router } from '@angular/router';
// import { ToastService } from '../../services/toast.service'; 


// @Component({
//   selector: 'app-user-dashboard',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './user-dashboard.component.html',
// })
// export class UserDashboardComponent implements OnInit {


//   private toast = inject(ToastService);

//   learningForm: FormGroup; 
  
//   categories: Category[] = [];
//   subCategories: SubCategory[] = [];
//   history: Prompt[] = [];

//   selectedUser: User | null = null;
//   isLoading: boolean = false;
//   currentResponse: string | null = null;
//   showHistory: boolean = false; 
//   @ViewChild('answerContainer') answerContainer!: ElementRef;
 

//   constructor(
//     private fb: FormBuilder,
//     private apiService: ApiService,
//     private router: Router
//   ) {
//     this.learningForm = this.fb.group({
//       category: ['', Validators.required],
//       subCategory: ['', Validators.required],
//       prompt: ['', [Validators.required, Validators.minLength(3)]]
//     });
//   }

//   ngOnInit(): void {
//     this.getUserDetails();
//     this.loadCategories(); 
//   }

//   getUserDetails() {
//     this.apiService.getCurrentUser().subscribe({
//       next: (user) => {
//         this.selectedUser = user;
//         if (user.id) {
//             this.loadUserHistory(user.id);
//         }
//       },
//       error: (err) => {
//         console.error("No logged-in user found", err);
//         this.toast.error('No logged-in user found, please log in again'); 
//         this.logout();
//       }
//     });
//   }

//   loadCategories(): void {
//     this.apiService.getCategories().subscribe({
//       next: (data) => {
//         this.categories = data;
//         this.subCategories = []; 
//       },
//       error: (err) => {
//         console.error('Failed to load categories', err);
//         this.toast.error('Failed to load categories');
//       }
//     });
//   }

//   loadUserHistory(userId: number): void {
//     this.apiService.getUserHistory(userId).subscribe({
//       next: (data) => this.history = data.reverse(), 
//       error: (err) => console.error('Failed to load history', err)
//     });
//   }

//   onCategoryChange(): void {
//     const categoryId = this.learningForm.get('category')?.value;
//     if (!categoryId) return;

//     this.subCategories = []; 
//     this.learningForm.patchValue({ subCategory: '' });

//     this.apiService.getSubCategories(categoryId).subscribe({
//       next: (data) => this.subCategories = data,
//       error: (err) => console.error(err)
//     });
//   }

//   submitPrompt(): void {
//     if (this.learningForm.invalid || !this.selectedUser) {
//       this.toast.error('Please fill in all fields correctly');
//       return;
//     }

//     this.isLoading = true;
//     this.currentResponse = null;


//     const formValues = this.learningForm.value;
//     const userId = this.selectedUser.id!; 

//     const request = {
//       user_id: userId,
//       category_id: Number(formValues.category),
//       sub_category_id: Number(formValues.subCategory),
//       prompt: formValues.prompt
//     };

//     this.apiService.createPrompt(request).subscribe({
//       next: (res) => {
//         this.currentResponse = res.response;
        
 
//         this.toast.success('Lesson generated successfully!');

//         this.loadUserHistory(userId); 
        
//         this.isLoading = false;
//         this.learningForm.patchValue({ prompt: '' });

//         setTimeout(() => {
//       if (this.answerContainer) {
//         this.answerContainer.nativeElement.scrollIntoView({ 
//           behavior: 'smooth', 
//           block: 'start' 
//         });
//       }
//     }, 100);
//       },
//       error: (err) => {
//         console.error('Error generating lesson', err);
//         this.isLoading = false;
        

//         this.toast.error('Error generating lesson. Please try again later.');
 
//       }
//     });
//   }
   
//   logout(): void {
//     this.apiService.logout(); 
//     this.router.navigate(['/login']);
//     this.toast.success('Logged out successfully');
//   }
// }

import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Category, SubCategory } from '../../models/category.model';
import { User } from '../../models/user.model';
import { Prompt } from '../../models/prompt.model';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-dashboard.component.html',
})
export class UserDashboardComponent implements OnInit {

  private toast = inject(ToastService);

  learningForm: FormGroup;
  
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  history: Prompt[] = [];

  selectedUser: User | null = null;
  isLoading: boolean = false;
  currentResponse: string | null = null;
  showHistory: boolean = false;
  
  // משתנים לניהול פתיחת התפריטים המעוצבים
  isCategoryOpen: boolean = false;
  isSubCategoryOpen: boolean = false;

  @ViewChild('answerContainer') answerContainer!: ElementRef;

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
        console.error("No logged-in user found", err);
        this.toast.error('No logged-in user found, please log in again');
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
      error: (err) => {
        console.error('Failed to load categories', err);
        this.toast.error('Failed to load categories');
      }
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

  // --- פונקציות חדשות לניהול ה-Select המעוצב ---

  toggleCategory() {
    this.isCategoryOpen = !this.isCategoryOpen;
    if (this.isCategoryOpen) this.isSubCategoryOpen = false;
  }

  toggleSubCategory() {
    this.isSubCategoryOpen = !this.isSubCategoryOpen;
    if (this.isSubCategoryOpen) this.isCategoryOpen = false;
  }

  selectCategory(catId: any) {
    this.learningForm.get('category')?.setValue(catId);
    this.onCategoryChange(); // טעינת תתי קטגוריות
    this.isCategoryOpen = false;
  }

  selectSubCategory(subId: any) {
    this.learningForm.get('subCategory')?.setValue(subId);
    this.isSubCategoryOpen = false;
  }

  getSelectedCategoryName(): string {
    const selectedId = this.learningForm.get('category')?.value;
    const category = this.categories.find(c => c.id == selectedId);
    return category ? category.name : 'Select a topic...';
  }

  getSelectedSubCategoryName(): string {
    const selectedId = this.learningForm.get('subCategory')?.value;
    const sub = this.subCategories.find(s => s.id == selectedId);
    return sub ? sub.name : 'Select sub-topic...';
  }

  // ------------------------------------------------

  submitPrompt(): void {
    if (this.learningForm.invalid || !this.selectedUser) {
      this.toast.error('Please fill in all fields correctly');
      return;
    }

    this.isLoading = true;
    this.currentResponse = null;

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
        
        this.toast.success('Lesson generated successfully!');
        this.loadUserHistory(userId);
        
        this.isLoading = false;
        this.learningForm.patchValue({ prompt: '' });

        setTimeout(() => {
          if (this.answerContainer) {
            this.answerContainer.nativeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }, 100);
      },
      error: (err) => {
        console.error('Error generating lesson', err);
        this.isLoading = false;
        this.toast.error('Error generating lesson. Please try again later.');
      }
    });
  }
   
  logout(): void {
    this.apiService.logout();
    this.router.navigate(['/login']);
    this.toast.success('Logged out successfully');
  }
}