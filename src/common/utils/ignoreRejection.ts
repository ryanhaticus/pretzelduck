export const ignoreRejection = <T>(
	promise: Promise<T>,
): Promise<T | undefined> => {
	return promise.catch(() => undefined);
};
