export const sleep = async (amount: number) => {
	await (new Promise(resolve => setTimeout(resolve, amount)));
};