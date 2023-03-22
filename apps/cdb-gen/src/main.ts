#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { generate, Params as GenerateParams } from "./app/generate";

yargs(hideBin(process.argv))
	.scriptName("cdb-gen")
	.command<GenerateParams>(
		"generate [options] <projectDir>",
		"Generate a compilation database (compile_commands.json) from a CMake project directory",
		yargs => yargs
			.options({
				watch: {
					boolean: true,
					alias: "W",
					default: false,
					describe: "Watch all `CMakeLists.txt` files in the directory tree and regnerate the compilation database when one of them changes.",
				},
			})
			.positional("projectDir", {
				type: "string",
				describe: "The project directory containing a `CMakeLists.txt` file",
				default: ".",
			}),
		generate,
	)
	// .strict()
	.parse();
