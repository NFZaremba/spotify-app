export interface ILocalStorage {
  name: string;
  data?: string | { [key: string]: unknown };
}

const localStorage = (method: string, { ...params }: ILocalStorage) => {
  const { name, data } = params;
  try {
    return window.localStorage[method](name, data);
  } catch (error) {
    console.error(error);
  }
};

const useLocalStorage = {
  get: ({ ...args }: ILocalStorage) => localStorage("getItem", { ...args }),
  set: ({ ...args }: ILocalStorage) => localStorage("setItem", { ...args }),
  remove: ({ ...args }: ILocalStorage) =>
    localStorage("removeItem", { ...args }),
};

export default useLocalStorage;
