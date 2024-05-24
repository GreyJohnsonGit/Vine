import { testImport } from './TestImport';

describe('Main', () => {
  it('should be true', () => {
    expect(testImport).toBe('testImport');
  });
});