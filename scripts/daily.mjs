#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  generate,
  loadWorkspaceEnv,
  parseArgs,
} from "./generate-daily-movie.mjs";
import { renderDailyMovie } from "./render-daily-movie.mjs";

async function main(argv = process.argv.slice(2)) {
  loadWorkspaceEnv();

  const options = parseArgs(argv);
  const dataPath = resolve("data.json");
  const data = await generate({ ...options, out: dataPath });
  await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  const output = await renderDailyMovie(data.date.iso);

  process.stdout.write(
    `${JSON.stringify(
      {
        success: true,
        movie: data.movie.title,
        quoteId: data.quote.id,
        ...output,
      },
      null,
      2,
    )}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
