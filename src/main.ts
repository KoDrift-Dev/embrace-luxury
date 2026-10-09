import './styles/main.css';
import { initSmooth } from './lib/motion';
import { initCursor } from './lib/cursor';
import { initCartGlobal } from './lib/store';
import { initTransitions, registerPage } from './lib/transitions';
import { runPreloader } from './lib/preloader';
import { initHome } from './pages/home';
import { initShop } from './pages/shop';
import { initServices } from './pages/services';
import { initContact } from './pages/contact';

// Reduced-motion: force visible states for reveal elements
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reduced');
}

registerPage('home', initHome);
registerPage('shop', initShop);
registerPage('services', initServices);
registerPage('contact', initContact);

initSmooth();
initCursor();
initCartGlobal();
initTransitions();
runPreloader(() => { /* pages listen for 'el:ready' to play intros */ });
