import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastState = signal({ show: false, message: '', type: 'success' });

  show(message: string, type: 'success' | 'error' = 'success') {

    this.toastState.set({ show: true, message, type });

    setTimeout(() => {
      this.toastState.update(state => ({ ...state, show: false }));
    }, 3000);
  }

  success(msg: string) { this.show(msg, 'success'); }
  error(msg: string) { this.show(msg, 'error'); }
}