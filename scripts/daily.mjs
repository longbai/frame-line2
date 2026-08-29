#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Poster } from "poster-ai";
import {
  generate,
  loadWorkspaceEnv,
  parseArgs,
} from "./generate-daily-movie.mjs";

async function main(argv = process.argv.slice(2)) {
  loadWorkspaceEnv();

  const options = parseArgs(argv);
  const dataPath = resolve("data.json");
  const sourcePath = resolve("src/daily-movie.tsx");
  const outputDir = resolve("output");
  const htmlPath = resolve(outputDir, "daily-movie.html");
  const pngPath = resolve(outputDir, "daily-movie.png");

  const data = await generate({ ...options, out: dataPath });
  await writeFile(dataPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await mkdir(outputDir, { recursive: true });

  const html = await new Poster().buildHtml(
    { file: sourcePath },
    { title: "电影日签" },
  );
  await writeFile(htmlPath, html);

  const png = await new Poster({ engine: "chrome" }).render(
    { file: sourcePath },
    { format: "png", deviceScaleFactor: 1 },
  );
  await writeFile(pngPath, png);

  process.stdout.write(
    `${JSON.stringify(
      {
        success: true,
        movie: data.movie.title,
        quoteId: data.quote.id,
        html: htmlPath,
        png: pngPath,
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
