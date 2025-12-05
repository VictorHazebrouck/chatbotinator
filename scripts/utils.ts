import { $, file, Glob } from "bun";

export type ProjectBunRunOptions = {
	command: string;
	parallelize: boolean;
	stop_on_first_error: boolean;
};

export async function project_bun_run(options: ProjectBunRunOptions): Promise<void> {
	const { command, stop_on_first_error, parallelize } = options;
	const glob = new Glob("{apps,packages}/*");
	const dirs = Array.from(glob.scanSync({ onlyFiles: false }));
	let exit_code = 0;

	const promises = dirs.map((dir) => async () => {
		const package_file = file(`${dir}/package.json`);
		if (!package_file.exists() || !package_file.size) {
			return;
		}
		const package_json = await package_file.json();
		if (!package_json?.scripts?.[command]) {
			return;
		}

		console.log(`\n  Running "${command}" in Project ${dir}:\n`);
		const { exitCode } = await $`cd ${dir} && bun run ${command}`.nothrow();
		if (exitCode !== 0 && exit_code === 0) {
			exit_code = exitCode;
		}
		if (stop_on_first_error) {
			process.exit(exit_code);
		}
	});

	if (parallelize) {
		await Promise.allSettled(promises.map((p) => p()));
	} else {
		for (const promise of promises) {
			await promise();
		}
	}

	process.exit(exit_code);
}
