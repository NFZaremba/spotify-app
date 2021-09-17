const catchErrors = (fn: Function) => {
  return async ({ pageParam }: { pageParam?: string }): Promise<any> => {
    try {
      return await fn({ pageParam });
    } catch (error) {
      console.error(error);
    }
  };
};

export default catchErrors;
