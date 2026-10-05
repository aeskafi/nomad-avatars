import { createApp, defineAsyncComponent } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';
import { definePreset } from '@primeuix/themes';
import Loader from './Loader.vue';

import './assets/reset.scss';
import 'primeicons/primeicons.css';

import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

const Theme = definePreset(Aura, {});

const AsyncApp = defineAsyncComponent({
  loader: () => import('./App.vue'),
  loadingComponent: Loader,
});

const app = createApp(AsyncApp);

app.use(createPinia());
app.use(
  createI18n({
    legacy: false,
    locale: navigator.language.split('-')[0],
    fallbackLocale: 'en',
    messages,
  }),
);
app.use(PrimeVue, {
  theme: {
    preset: Theme,
    options: {
      darkModeSelector: '.dark',
    },
  },
});

app.mount('#app');
