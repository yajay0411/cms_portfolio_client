import {
  clearAllStorage,
  clearLS,
  clearSS,
  getFromCS,
  getFromLS,
  getFromSS,
  removeFromCS,
  removeFromLS,
  removeFromSS,
  setInCS,
  setInLS,
  setInSS
} from '@utils/browserStorage';

describe('browserStorage', () => {
  afterEach(() => {
    clearAllStorage();
  });

  test('should clear all storage', () => {
    setInLS('key1', 'value1');
    setInSS('key2', 'value2');
    setInCS('key3', 'value3');

    expect(localStorage.getItem('key1')).toBe('"value1"');
    expect(sessionStorage.getItem('key2')).toBe('"value2"');
    expect(getFromCS('key3')).toBe('value3');

    clearAllStorage();

    expect(localStorage.getItem('key1')).toBeNull();
    expect(sessionStorage.getItem('key2')).toBeNull();
    expect(getFromCS('key3')).toBeUndefined();
  });

  test('should clear local storage', () => {
    setInLS('key1', 'value1');
    expect(localStorage.getItem('key1')).toBe('"value1"');

    clearLS();

    expect(localStorage.getItem('key1')).toBeNull();
  });

  test('should clear session storage', () => {
    setInSS('key2', 'value2');
    expect(sessionStorage.getItem('key2')).toBe('"value2"');

    clearSS();

    expect(sessionStorage.getItem('key2')).toBeNull();
  });

  test('should remove from local storage', () => {
    setInLS('key1', 'value1');
    expect(localStorage.getItem('key1')).toBe('"value1"');

    removeFromLS('key1');

    expect(localStorage.getItem('key1')).toBeNull();
  });

  test('should remove from session storage', () => {
    setInSS('key2', 'value2');
    expect(sessionStorage.getItem('key2')).toBe('"value2"');

    removeFromSS('key2');

    expect(sessionStorage.getItem('key2')).toBeNull();
  });

  test('should remove from cookie storage', () => {
    setInCS('key3', 'value3');
    expect(getFromCS('key3')).toBe('value3');

    removeFromCS('key3');

    expect(getFromCS('key3')).toBeUndefined();
  });

  test('should set in local storage', () => {
    setInLS('key1', 'value1');

    expect(localStorage.getItem('key1')).toBe('"value1"');
  });

  test('should set in session storage', () => {
    setInSS('key2', 'value2');

    expect(sessionStorage.getItem('key2')).toBe('"value2"');
  });

  test('should set in cookie storage', () => {
    setInCS('key3', 'value3');

    expect(getFromCS('key3')).toBe('value3');
  });

  test('should set and get value from local storage', () => {
    const key = 'key1';
    const value = 'value1';

    setInLS(key, value);
    expect(getFromLS<string>(key)).toBe(value);
  });

  test('should set and get value from session storage', () => {
    const key = 'key2';
    const value = 'value2';

    setInSS(key, value);
    expect(getFromSS<string>(key)).toBe(value);
  });

  test('should set and get value from cookie storage', () => {
    const key = 'key3';
    const value = 'value3';

    setInCS(key, value);
    expect(getFromCS<string>(key)).toBe(value);
  });
});
