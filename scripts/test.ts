import { project_bun_run } from "./utils";

project_bun_run({
	command: "test",
	parallelize: true,
	stop_on_first_error: false,
});
