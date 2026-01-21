import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading: boolean = false;

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
    const { name, phone } = this.signupForm.value;

    this.apiService.createUser(name, phone).subscribe({
      next: (newUser) => {
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.router.navigate(['/user']);
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        alert('שגיאה ביצירת משתמש. אולי הטלפון כבר קיים במערכת?');
      }
    });
  }
}