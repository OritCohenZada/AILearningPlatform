import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule], 
  templateUrl: './home.component.html',
})
export class HomeComponent {
  
  contactForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toast: ToastService
  ) {

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  onSendMessage() {
    if (this.contactForm.invalid) return;

    this.isSubmitting = true;
    
    const { name, email, message } = this.contactForm.value;


    this.apiService.sendContactMessage(name, email, message).subscribe({
      next: (response) => {
        this.toast.success('Great! Your message was sent.')
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error sending message:', err);
         this.isSubmitting = false;
       this.toast.error('Something went wrong. Please try again.')
       
      }
    });
  }
}