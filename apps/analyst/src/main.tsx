import { createApp } from 'vue';
import '@dewr/ui-tokens/styles.css';
import '@dewr/ui-library/styles.css';
import '@dewr/map-engine/styles.css';
import './styles.css';
import App from './App.vue';
import { enableApiMocks } from './mocks/enableApiMocks';

enableApiMocks().then(() => {
  createApp(App).mount('#root');
});
