type ImportMetaWithEnv = ImportMeta & {
  env?: Record<string, string | undefined>;
};

function readPublicEnv(key: string, fallback = '') {
  const importMetaEnv = (import.meta as ImportMetaWithEnv).env?.[key];
  if (typeof importMetaEnv === 'string' && importMetaEnv.trim()) {
    return importMetaEnv.trim();
  }

  return fallback;
}

function joinUrl(base: string, path: string) {
  const trimmedBase = base.replace(/\/+$/, '');
  const trimmedPath = path.replace(/^\/+/, '');
  return `${trimmedBase}/${trimmedPath}`;
}

export const NEXT_PUBLIC_DEWR_API = readPublicEnv(
  'NEXT_PUBLIC_DEWR_API',
  'https://no-fallback-for-dewr-api'
);

export const DEWR_WORKFORCE_DATASET_PATH =
  '/api/v1/workforce-intelligence/pathways/dataset';

export const withDewrApi = (path: string) => joinUrl(NEXT_PUBLIC_DEWR_API, path);
