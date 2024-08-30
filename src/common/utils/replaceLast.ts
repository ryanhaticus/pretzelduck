export const replaceLast = (str: string, find: string, replace: string) => {
	const index = str.lastIndexOf(find);

	if (index === -1) {
		return str;
	}

	return `${str.substring(0, index)}${replace}${str.substring(index + find.length)}`;
};
