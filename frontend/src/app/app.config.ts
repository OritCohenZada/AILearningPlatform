import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes'; // מוודא שרשימת המסכים מיובאת

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), // <--- מחבר את הניווט (כדי שהדשבורד יופיע)
    provideHttpClient()    // <--- מחבר את השרת (כדי שלא תהיה שגיאה בטעינה)
  ]
};