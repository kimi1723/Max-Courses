function merge<T extends object, U extends keyof T>(objA: T, key: U) {
	return objA[key];
}

const mergedObj = merge({ name: 'elo' }, 'name');

console.log(mergedObj);
