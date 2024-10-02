type ApiKeyType = 'public' | 'secret' | 'unknown';
type ApiKeyEnvironment = 'test' | 'production' | 'unknown';

export interface ApiKeyInfo {
  type: ApiKeyType;
  environment: ApiKeyEnvironment;
  value: string;
}

export interface BothApiKeys {
  secretKey: ApiKeyInfo;
  publicKey: ApiKeyInfo;
}

export const extractApiKeyInfo = (key: string): ApiKeyInfo => {
  const prefixes = [
    { type: 'public', env: 'test', prefix: 'NA_PUB_TEST-' },
    { type: 'secret', env: 'test', prefix: 'NA_SEC_TEST-' },
    { type: 'public', env: 'production', prefix: 'NA_PUB_PROD-' },
    { type: 'secret', env: 'production', prefix: 'NA_SEC_PROD-' },
  ];

  for (const { type, env, prefix } of prefixes) {
    if (key.startsWith(prefix)) {
      const value = key;
      return { type, environment: env, value } as ApiKeyInfo;
    }
  }

  return { type: 'unknown', environment: 'unknown', value: '' } as ApiKeyInfo;
}
