import cmd from "@dm/cmd";
import * as chalk from "chalk";
import * as path from "path";
import * as fs from "fs";

export interface Params {
	projectDir: string;
	watch: boolean;
}

export async function generate({ projectDir, watch }: Params) {
	try {
		if (watch) {
			console.log("TODO: Implement watcher");
			await generate_impl(projectDir);
		}
		else {
			await generate_impl(projectDir);
			process.exit(0);
		}
	}
	catch (err) {
		if (err instanceof Error) {
			console.log(chalk.bold.redBright(err.message));
			if (err.stack)
				console.log(chalk.red(err.stack.split("\n").slice(1).join("\n")));
		}
		else if (typeof err === "number") {
			process.exit(err);
		}
		else {
			console.log(chalk.bold.redBright("Error:"), err);
		}
	}
}

async function generate_impl(projectDir: string) {
	projectDir = path
		.resolve(process.cwd(), projectDir)
		.replace(/[\/\\]/g, "/");

	const clangDir = path.join(projectDir, ".clangd");
	if (!fs.existsSync(clangDir))
		await fs.promises.mkdir(clangDir);

	await cmd.run("cmake", ["-G", `"MinGW Makefiles"`, ".."], {
		cwd: clangDir,
		shell: true,
		stdio: ["pipe", "inherit", "inherit"],
	});

	const cdbFile = path.join(clangDir, "compile_commands.json");
	if (!fs.existsSync(cdbFile))
		throw new Error("CMake did not create a `compile_commands.json` file");

	const buildDir = path.join(projectDir, "build");
	if (!fs.existsSync(buildDir))
		await fs.promises.mkdir(buildDir);

	await fs.promises.copyFile(cdbFile, path.join(buildDir, "compile_commands.json"));
}
