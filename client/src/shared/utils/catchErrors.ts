const catchErrors = (fn: () => void) => {
  return async (): Promise<any> => {
    try {
      return await fn();
    } catch (error) {
      console.error(error);
    }
  };
};

export default catchErrors;
