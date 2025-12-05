import { $ } from "bun";

await $`cd packages/auth && bun migrate`;
await $`cd packages/db && bun migrate`;
