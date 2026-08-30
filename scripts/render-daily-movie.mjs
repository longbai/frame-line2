#!/usr/bin/env node

import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { Poster } from "poster-ai";

export function shanghaiTimestamp(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error(`无效生成时间：${value}`);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
  return `${part("year")}${part("month")}${part("day")}-${part("hour")}${part("minute")}${part("second")}-${milliseconds}`;
}

export function timestampedOutputPaths(
  date,
  generatedAt = new Date(),
  outputDir = resolve("output"),
) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error(`输出日期必须是 YYYY-MM-DD：${date}`);
  }
  const basename = `daily-movie-${date}_${shanghaiTimestamp(generatedAt)}`;
  return {
    html: resolve(outputDir, `${basename}.html`),
    png: resolve(outputDir, `${basename}.png`),
  };
}

export async function renderDailyMovie(
  date,
  { html = true, png = true } = {},
) {
  const sourcePath = resolve("src/daily-movie.tsx");
  const outputDir = resolve("output");
  const paths = timestampedOutputPaths(date, new Date(), outputDir);
  await mkdir(outputDir, { recursive: true });

  if (html) {
    const document = await new Poster().buildHtml(
      { file: sourcePath },
      { title: "电影日签" },
    );
    await writeFile(paths.html, document);
  }

  if (png) {
    const image = await new Poster({ engine: "chrome" }).render(
      { file: sourcePath },
      { format: "png", deviceScaleFactor: 1 },
    );
    await writeFile(paths.png, image);
  }

  return {
    ...(html ? { html: paths.html } : {}),
    ...(png ? { png: paths.png } : {}),
  };
}

async function main(argv = process.argv.slice(2)) {
  const data = JSON.parse(await readFile(resolve("data.json"), "utf8"));
  const mode = argv[0] || "--all";
  if (!["--all", "--html", "--png"].includes(mode)) {
    throw new Error(`未知渲染模式：${mode}`);
  }
  const output = await renderDailyMovie(data.date.iso, {
    html: mode !== "--png",
    png: mode !== "--html",
  });
  process.stdout.write(`${JSON.stringify({ success: true, ...output }, null, 2)}\n`);
}

const isEntry = process.argv[1]
  ? import.meta.url === pathToFileURL(resolve(process.argv[1])).href
  : false;

if (isEntry) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
