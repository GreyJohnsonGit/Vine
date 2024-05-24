/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  clearMocks: true,
  transform: {},
  extensionsToTreatAsEsm: ['.ts'],
};

export default config;