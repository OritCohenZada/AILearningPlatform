import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service'; 

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading: boolean = false;


  private toast = inject(ToastService);
  private apiService=inject(ApiService)

  constructor(
    private fb: FormBuilder,
    private router: Router,

  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required]
    });
  }

  onSignup(): void {
    if (this.signupForm.invalid) {
      this.toast.error('Please fill in all required fields'); 
      return;
    }

    this.isLoading = true;
    const { name, phone } = this.signupForm.value;


    this.apiService.createUser(name, phone).subscribe({
      next: () => {
        

        this.apiService.login(name, phone).subscribe({
          next: () => {

            this.toast.success('Account created successfully! Welcome.');
            this.router.navigate(['/user']);
          },
          error: (loginErr) => {
    
            this.toast.success('Account created. Please log in.');
            this.router.navigate(['/login']);
          }
        });

      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      
        if (err.status === 400) {
           this.toast.error('Phone number already registered');
        } else {
           this.toast.error('Signup failed. Please try again later.');
        }
      }
    });
  }
}