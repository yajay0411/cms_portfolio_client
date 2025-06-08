import Cookies from 'js-cookie';

// Types
type CookieAttributes = Cookies.CookieAttributes;

// Local Storage
export const getFromLS = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item from localStorage [${key}]:`, error);
    return null;
  }
};

export const setInLS = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item in localStorage [${key}]:`, error);
  }
};

export const removeFromLS = (key: string): void => {
  localStorage.removeItem(key);
};

export const clearLS = (): void => {
  localStorage.clear();
};

// Cookie Storage
export const getFromCS = <T extends string>(key: string): T | undefined => {
  return Cookies.get(key) as T | undefined;
};

export const setInCS = (
  key: string,
  value: string,
  options?: CookieAttributes
): void => {
  Cookies.remove(key);
  Cookies.set(key, value, options);
};

export const removeFromCS = (key: string, options?: CookieAttributes): void => {
  Cookies.remove(key, options);
};

export const clearCS = (): void => {
  const cookies = Cookies.get();
  Object.keys(cookies).forEach((key) => removeFromCS(key));
};

// Combined operations
export const clearAllStorage = (): void => {
  clearLS();
  clearCS();
};
