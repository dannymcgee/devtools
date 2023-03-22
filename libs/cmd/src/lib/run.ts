import * as cp from "child_process";
import * as path from "path";

export function run(cmd: string, args: string[], opts: cp.SpawnOptions): Promise<void> {
	const errorForCode = (code: number) => new Error(
		`${path.basename(cmd)} exited with code ${code}`
	);

	return new Promise((resolve, reject) => {
		cp.spawn(cmd, args, opts)
			.on("error", error => reject(error))
			.on("close", code => {
				if (code) reject(errorForCode(code));
				else resolve();
			});
	});
}
