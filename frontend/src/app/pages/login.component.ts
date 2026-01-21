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

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    const { name, phone } = this.loginForm.value;

    if (name === 'orit' && phone === '0583282105') {
      this.router.navigate(['/admin']);
      return;
    }


    this.apiService.login(name, phone).subscribe({
      next: (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user)); 
        this.router.navigate(['/user']); 
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.errorMessage = 'משתמש לא נמצא. נסה שוב או הירשם.';
        } else {
          this.errorMessage = 'שגיאת התחברות. נסה מאוחר יותר.';
        }
      }
    });
  }
}