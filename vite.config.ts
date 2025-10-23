import { defineConfig } from 'vite';
import { ViteMinifyPlugin } from 'vite-plugin-minify';
import { resolve } from 'path';
import dotenv from 'dotenv';
import nunjucks from 'vite-plugin-nunjucks';

dotenv.config();

const commonVars = {
  gtmId: process.env.VITE_GTM_ID,
  faceId: process.env.VITE_FB_ID,
  loginUrl: process.env.VITE_B2C_URL_LOGIN,
  signupUrl: process.env.VITE_B2C_URL_SIGNUP,
  pwdUrl: process.env.VITE_B2C_URL_PWD,
};

// Páginas del proyecto
const pages = [
  // Escenario 1: Completar registro
  'scenario-1-step-1-password',
  'scenario-1-step-2-mfa',
  'scenario-1-step-3-otp',
  'scenario-1-step-4-success',
  
  // Escenario 2-3: Email link
  'scenario-2-3-step-1-password',
  'scenario-2-3-step-2-mfa',
  'scenario-2-3-step-3-otp',
  'scenario-2-3-step-4-success',
  
  // Escenario 4: Registro orgánico
  'scenario-4-step-1-login',
  'scenario-4-step-2-policy',
  
  // Escenario 5: Login existente
  'scenario-5-step-1-login',
  'scenario-5-step-2-mfa',
  'scenario-5-step-3-otp',
  'scenario-5-step-4-loading',
  
  // Escenario 6: Contraseña vencida
  'scenario-6-step-1-login',
  'scenario-6-step-2-mfa',
  'scenario-6-step-3-otp',
  'scenario-6-step-4-expired',
  'scenario-6-step-5-success',
];

const nunjucksVariables = pages.reduce((acc, page) => {
  acc[`${page}.html`] = {
    page,
    ...commonVars,
  };
  return acc;
}, {} as Record<string, any>);

export default defineConfig({
  base: process.env.VITE_URL_BASE || '/',
  plugins: [
    nunjucks({
      variables: nunjucksVariables,
    }),
    ViteMinifyPlugin(),
  ],
  appType: 'mpa',
  root: 'src',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@core': resolve(__dirname, './src/core'),
      '@components': resolve(__dirname, './src/components'),
      '@scenarios': resolve(__dirname, './src/scenarios'),
      '@utils': resolve(__dirname, './src/utils'),
      '@assets': resolve(__dirname, './src/assets'),
    },
  },
  preview: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: [process.env.VITE_URL_DOMAIN || 'localhost'],
  },
  build: {
    rollupOptions: {
      treeshake: true,
      input: {
        // Escenario 5: Login existente ✅
        'scenario-5-step-1': resolve(__dirname, 'src/scenarios/scenario-5-existing-login/step-1-login.html'),
        'scenario-5-step-2': resolve(__dirname, 'src/scenarios/scenario-5-existing-login/step-2-mfa.html'),
        'scenario-5-step-3': resolve(__dirname, 'src/scenarios/scenario-5-existing-login/step-3-otp.html'),
        'scenario-5-step-4': resolve(__dirname, 'src/scenarios/scenario-5-existing-login/step-4-loading.html'),
        
        // Escenario 6: Contraseña vencida ✅
        'scenario-6-step-1': resolve(__dirname, 'src/scenarios/scenario-6-expired-password/step-1-login.html'),
        'scenario-6-step-2': resolve(__dirname, 'src/scenarios/scenario-6-expired-password/step-2-mfa.html'),
        'scenario-6-step-3': resolve(__dirname, 'src/scenarios/scenario-6-expired-password/step-3-otp.html'),
        'scenario-6-step-4': resolve(__dirname, 'src/scenarios/scenario-6-expired-password/step-4-expired.html'),
        'scenario-6-step-5': resolve(__dirname, 'src/scenarios/scenario-6-expired-password/step-5-success.html'),
        
        // Los demás escenarios se agregarán progresivamente
      },
    },
    outDir: '../build',
  },
});
