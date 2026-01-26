// בדיקה מהירה של ToastService
// הוסף את זה לקונסול בדפדפן:

// בדיקת הודעת הצלחה
setTimeout(() => {
  const toastService = document.querySelector('app-root')?.__ngContext__?.[0]?.toastService;
  if (toastService) {
    toastService.success('Test success message!');
  }
}, 1000);

// בדיקת הודעת שגיאה
setTimeout(() => {
  const toastService = document.querySelector('app-root')?.__ngContext__?.[0]?.toastService;
  if (toastService) {
    toastService.error('Test error message!');
  }
}, 3000);