/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_BRAND_NAME?: string;
  readonly VITE_BRAND_SLOGAN?: string;
  readonly VITE_BRAND_LOGO_URL?: string;
  readonly VITE_BRAND_EMAIL?: string;
  readonly VITE_BRAND_PHONE?: string;
  readonly VITE_BRAND_ADDRESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
