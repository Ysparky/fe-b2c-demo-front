/// <reference types="vite/client" />

/**
 * Definición de tipos para variables de entorno de Vite
 * Este archivo extiende la interfaz ImportMetaEnv con las variables específicas del proyecto
 */
interface ImportMetaEnv {
  readonly VITE_GTM_ID: string;
  readonly VITE_FB_ID: string;
  readonly VITE_B2C_URL_LOGIN: string;
  readonly VITE_B2C_URL_SIGNUP: string;
  readonly VITE_B2C_URL_PWD: string;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
  readonly VITE_API_BASE_URL?: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}