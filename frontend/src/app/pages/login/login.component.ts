import { Component ,inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service'; 
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {

  loginForm: FormGroup;
  isLoading: boolean = false;

    private toast = inject(ToastService);
    private apiService = inject(ApiService);

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      if (this.loginForm.get('phone')?.hasError('pattern')) {
        this.toast.error('Phone number must be exactly 10 digits');
      } else {
        this.toast.error('Please fill in all required fields');
      }
      return;
    }

    this.isLoading = true;
    const { name, phone } = this.loginForm.value;

    this.apiService.login(name, phone).subscribe({
      next: () => {

        this.toast.success('Login successful! Welcome back.');

        if (this.apiService.isAdmin()) {
          this.router.navigate(['/admin']); 
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        

        if (err.status === 404 || err.status === 401) {
          this.toast.error('Incorrect credentials');
        } else {
          console.error(err); 
          this.toast.error('Server error. Please try again.');
        }
      }
    });
  }
}