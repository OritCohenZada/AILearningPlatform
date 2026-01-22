import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service'; // ודאי שהנתיב נכון

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  onSignup(): void {
    if (this.signupForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const { name, phone } = this.signupForm.value;

    // 1. שלב ראשון: יצירת המשתמש
    this.apiService.createUser(name, phone).subscribe({
      next: () => {
        
        // 2. שלב שני: כניסה אוטומטית (כדי לקבל את הטוקן!)
        console.log("הרשמה הצליחה, מבצע כניסה אוטומטית...");
        
        this.apiService.login(name, phone).subscribe({
          next: () => {
            // 3. שלב שלישי: ניווט לדף המשתמש
            console.log("כניסה אוטומטית הצליחה!");
            this.router.navigate(['/user']);
          },
          error: (loginErr) => {
            console.error("הרשמה הצליחה אבל כניסה נכשלה", loginErr);
            this.isLoading = false;
            // במקרה נדיר זה, נעביר אותו ללוגין ידני
            this.router.navigate(['/login']);
          }
        });

      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        if (err.status === 400) {
           this.errorMessage = 'הטלפון הזה כבר רשום במערכת.';
        } else {
           this.errorMessage = 'שגיאה ביצירת משתמש. נסה שוב.';
        }
      }
    });
  }
}