import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink], // <--- מאפשרים שימוש בראוטר ובלינקים
  templateUrl: './app.html',
})
export class AppComponent {
  title = 'AI Learning Platform';
}