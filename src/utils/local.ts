export function localGet(key: string) {
  const value = window.localStorage.getItem(key);
  try {
    return JSON.parse(window?.localStorage?.getItem(key) || "");
  } catch (error) {
    return value;
  }
}

export function localSet(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function localRemove(key: string) {
  window.localStorage.removeItem(key);
}

export function sessionGet(key: string) {
  const value = window.sessionStorage.getItem(key);
  try {
    return JSON.parse(window?.sessionStorage?.getItem(key) || "");
  } catch (error) {
    return value;
  }
}

export function sessionSet(key: string, value: any) {
  window.sessionStorage.setItem(key, JSON.stringify(value));
}

export function sessionRemove(key: string) {
  window.sessionStorage.removeItem(key);
}
