export default {
	"*": [
		() => "bun run format --",
		() => "bun run lint --",
		() => "bun run check-types --",
		() => "bun run test --",
	],
};
