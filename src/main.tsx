import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with auto-update
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('ChargoX update available, auto-updating...');
  },
  onOfflineReady() {
    console.log('ChargoX is ready for offline use');
  },
});

createRoot(document.getElementById('root')!).render(<App />);

