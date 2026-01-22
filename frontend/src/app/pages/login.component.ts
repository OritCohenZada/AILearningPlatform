// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { ApiService } from '../services/api.service'; 

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterLink],
//   templateUrl: './login.component.html',
// })
// export class LoginComponent {

//   loginForm: FormGroup;
//   errorMessage: string = '';
//   isLoading: boolean = false;

//   constructor(
//     private fb: FormBuilder,
//     private apiService: ApiService,
//     private router: Router
//   ) {
//     this.loginForm = this.fb.group({
//       name: ['', Validators.required],
//       phone: ['', Validators.required]
//     });
//   }

//   onSubmit(): void {
//     if (this.loginForm.invalid) return;

//     this.isLoading = true;
//     this.errorMessage = '';
//     const { name, phone } = this.loginForm.value;

//     this.apiService.login(name, phone).subscribe({
//       next: () => {
//         if (this.apiService.isAdmin()) {
//           this.router.navigate(['/admin']); 
//         } else {
//         this.router.navigate(['/user']);
//         }
//       },
//       error: (err) => {
//         this.isLoading = false;
        

//         if (err.status === 404 || err.status === 401) {
//           this.errorMessage = 'שם משתמש או טלפון שגויים.';
//         } else {
//           console.error(err); 
//           this.errorMessage = 'שגיאת התחברות. נסה מאוחר יותר.';
//         }
//       }
//     });
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',

})
export class LoginComponent {

  // משתנים לניהול המצב והאנימציה (לעיצוב החדש)
  isLoginMode: boolean = true; 
  isLoading: boolean = false;
  errorMessage: string = '';

  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    // טופס לוגין
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required]
    });

    // טופס הרשמה
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]] // ולידציה לטלפון ישראלי
    });
  }

  // פונקציה להחלפת צדדים (מפעילה את האנימציה)
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = ''; // איפוס שגיאות במעבר
  }

  // --- לוגיקת התחברות (LOGIN) ---
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const { name, phone } = this.loginForm.value;

    this.apiService.login(name, phone).subscribe({
      next: (response) => {
        this.isLoading = false;
        // בדיקה האם מנהל או משתמש רגיל
        if (this.apiService.isAdmin()) {
          this.router.navigate(['/admin']); 
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        if (err.status === 404 || err.status === 401) {
          this.errorMessage = 'Incorrect username or phone number.';
        } else {
          this.errorMessage = 'Login failed. Please try again later.';
        }
      }
    });
  }

  // --- לוגיקת הרשמה (הלוגיקה שלך + כניסה אוטומטית) ---
  onSignup(): void {
    if (this.signupForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const { name, phone } = this.signupForm.value;

    // 1. יצירת המשתמש
    this.apiService.createUser(name, phone).subscribe({
      next: () => {
        console.log("Signup successful, attempting auto-login...");
        
        // 2. כניסה אוטומטית (בדיוק כמו בקוד שלך)
        this.apiService.login(name, phone).subscribe({
          next: () => {
            console.log("Auto-login successful!");
            this.isLoading = false;
            // ניווט לדף המשתמש
            this.router.navigate(['/user']);
          },
          error: (loginErr) => {
            console.error("Signup success but Login failed", loginErr);
            this.isLoading = false;
            // אם הכניסה האוטומטית נכשלה, נעביר אותו למסך הלוגין באנימציה
            this.toggleMode(); 
            this.errorMessage = "Account created. Please log in manually.";
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        if (err.status === 400) {
           this.errorMessage = 'This phone number is already registered.';
        } else {
           this.errorMessage = 'Error creating account. Please try again.';
        }
      }
    });
  }
}