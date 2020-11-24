function includeKeys<T, K extends keyof T>(obj: T, keys: K[]): Partial<T> {
	const ret = {} as Partial<T>
	keys.forEach((key) => {
		ret[key] = obj[key]
	})
	return ret
}

export { includeKeys }
