import { theme, ThemeConfig } from 'antd';

import tokens from './tokens.json';

type TokenLayer = {
  token?: Record<string, unknown>;
  components?: Record<string, Record<string, unknown>>;
};

type TokensFile = {
  base?: TokenLayer;
  light?: TokenLayer;
  dark?: TokenLayer;
};

const mergeComponents = (
  base: Record<string, Record<string, unknown>> = {},
  override: Record<string, Record<string, unknown>> = {}
): Record<string, Record<string, unknown>> => {
  const keys = new Set([...Object.keys(base), ...Object.keys(override)]);
  const result: Record<string, Record<string, unknown>> = {};

  for (const key of keys) {
    result[key] = { ...(base[key] ?? {}), ...(override[key] ?? {}) };
  }

  return result;
};

const antdTheme = (isDark: boolean): ThemeConfig => {
  const file = tokens as TokensFile;
  const base = file.base ?? {};
  const layer = (isDark ? file.dark : file.light) ?? {};

  const mergedToken = { ...(base.token ?? {}), ...(layer.token ?? {}) };
  const mergedComponents = mergeComponents(base.components, layer.components);

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: mergedToken as ThemeConfig['token'],
    components: mergedComponents as ThemeConfig['components']
  };
};

export default antdTheme;
