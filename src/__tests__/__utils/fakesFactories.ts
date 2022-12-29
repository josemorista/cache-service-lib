export const createFakeCacheStrategy = () => ({
	del: jest.fn(),
	get: jest.fn(),
	delByPrefix: jest.fn(),
	set: jest.fn(),
	flush: jest.fn()
});