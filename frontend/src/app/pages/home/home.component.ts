import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

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
    private apiService: ApiService
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

    // שליחה לשרת דרך הסרביס
    this.apiService.sendContactMessage(name, email, message).subscribe({
      next: (response) => {
        alert('ההודעה נשלחה בהצלחה! מנהל האתר יחזור אליך בקרוב. ');
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error sending message:', err);
         this.isSubmitting = false;
        alert('אופס, הייתה בעיה בשליחת ההודעה. נסה שוב מאוחר יותר.');
       
      }
    });
  }
}