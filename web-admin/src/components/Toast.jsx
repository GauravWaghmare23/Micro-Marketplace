import { useUIStore } from '../context/store';
import { Toaster, toast } from 'sonner';

export function Toast() {
  return (
    <Toaster
      theme="dark"
      position="bottom-right"
      richColors
      closeButton
    />
  );
}

export function showToast(message, type = 'info') {
  toast[type](message);
}
