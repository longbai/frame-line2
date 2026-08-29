#!/usr/bin/env node

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { loadEnvFile } from "node:process";
import { pathToFileURL } from "node:url";
import QRCode from "qrcode";

export const QUOTE_URL =
  "https://raw.githubusercontent.com/hitokoto-osc/sentences-bundle/master/sentences/h.json";
const TMDB_API = "https://api.themoviedb.org/3";
const TMDB_IMAGE = "https://image.tmdb.org/t/p/original";
const OMDB_API = "https://www.omdbapi.com/";
const OUTPUT_FILE = resolve("data.json");
const DEFAULT_CONFIG_FILE = resolve("config.json");

const DEMO_MOVIE = {
  title: "绿皮书",
  originalTitle: "Green Book",
  director: "彼得·法雷里",
  year: "2018",
  stillUrl: `${TMDB_IMAGE}/5En0fmDagt3Pk8d7P3uTwfeQceg.jpg`,
  tmdbUrl: "https://www.themoviedb.org/movie/490132?language=zh-CN",
  imdbId: "tt6966692",
};

export function parseArgs(argv) {
  const options = {
    date: shanghaiDate(),
    quoteId: null,
    qrUrl: process.env.DAILY_POSTER_QR_URL || null,
    embedImage: false,
    demo: false,
    out: OUTPUT_FILE,
    config: DEFAULT_CONFIG_FILE,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--demo") options.demo = true;
    else if (arg === "--embed-image") options.embedImage = true;
    else if (arg === "--date") options.date = requiredValue(argv, ++index, arg);
    else if (arg.startsWith("--date=")) options.date = arg.slice(7);
    else if (arg === "--quote-id") options.quoteId = Number(requiredValue(argv, ++index, arg));
    else if (arg.startsWith("--quote-id=")) options.quoteId = Number(arg.slice(11));
    else if (arg === "--qr-url") options.qrUrl = requiredValue(argv, ++index, arg);
    else if (arg.startsWith("--qr-url=")) options.qrUrl = arg.slice(9);
    else if (arg === "--out") options.out = resolve(requiredValue(argv, ++index, arg));
    else if (arg.startsWith("--out=")) options.out = resolve(arg.slice(6));
    else if (arg === "--config") options.config = resolve(requiredValue(argv, ++index, arg));
    else if (arg.startsWith("--config=")) options.config = resolve(arg.slice(9));
    else throw new Error(`未知参数：${arg}`);
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(options.date)) {
    throw new Error(`日期必须是 YYYY-MM-DD：${options.date}`);
  }
  if (options.quoteId !== null && !Number.isInteger(options.quoteId)) {
    throw new Error("--quote-id 必须是整数");
  }
  return options;
}

export function loadWorkspaceEnv(envPath = resolve(".env")) {
  if (!existsSync(envPath)) return false;
  loadEnvFile(envPath);
  return true;
}

export async function loadPosterConfig(configPath = DEFAULT_CONFIG_FILE) {
  if (!existsSync(configPath)) {
    throw new Error(`找不到日签配置文件：${configPath}`);
  }
  try {
    return JSON.parse(await readFile(configPath, "utf8"));
  } catch (error) {
    throw new Error(`日签配置文件无效：${configPath}（${error.message}）`);
  }
}

function requiredValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith("--")) throw new Error(`${flag} 缺少值`);
  return value;
}

function shanghaiDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function hashString(value) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function selectQuote(quotes, date, quoteId = null, demo = false) {
  const candidates = quotes.filter(
    (item) => item?.type === "h" && item?.hitokoto && item?.from,
  );
  if (candidates.length === 0) throw new Error("金句数据中没有可用的影视条目");

  if (quoteId !== null) {
    const chosen = candidates.find((item) => item.id === quoteId);
    if (!chosen) throw new Error(`找不到金句 id=${quoteId}`);
    return chosen;
  }

  if (demo) {
    const chosen = candidates.find(
      (item) => normalizeTitle(item.from) === normalizeTitle("绿皮书"),
    );
    if (chosen) return chosen;
  }

  return candidates[hashString(date) % candidates.length];
}

export function normalizeTitle(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[《》〈〉「」『』“”‘’]/g, "")
    .replace(/\s+/g, "")
    .replace(/[·:：!！?？,，。._\-—]/g, "")
    .toLocaleLowerCase("zh-CN");
}

export function scoreTmdbCandidate(candidate, query) {
  const normalizedQuery = normalizeTitle(query);
  const title = normalizeTitle(candidate.title);
  const originalTitle = normalizeTitle(candidate.original_title);
  let score = Math.log10(Number(candidate.popularity || 0) + 1);
  if (title === normalizedQuery) score += 100;
  if (originalTitle === normalizedQuery) score += 90;
  if (title.includes(normalizedQuery) || normalizedQuery.includes(title)) score += 20;
  if (
    originalTitle.includes(normalizedQuery) ||
    normalizedQuery.includes(originalTitle)
  ) {
    score += 15;
  }
  if (candidate.backdrop_path) score += 4;
  if (candidate.poster_path) score += 1;
  return score;
}

function tmdbCredentials() {
  const token = (
    process.env.TMDB_READ_ACCESS_TOKEN || process.env.TMDB_API_TOKEN
  )?.trim();
  const apiKey = process.env.TMDB_API_KEY?.trim();
  if (!token && !apiKey) {
    throw new Error(
      "缺少 TMDB_API_TOKEN 或 TMDB_API_KEY。只查看版式可使用 --demo。",
    );
  }
  return { token, apiKey };
}

async function tmdbGet(path, params = {}) {
  const { token, apiKey } = tmdbCredentials();
  const url = new URL(`${TMDB_API}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  if (apiKey) url.searchParams.set("api_key", apiKey);
  return fetchJson(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

async function omdbGet(params) {
  const apiKey = process.env.OMDB_API_KEY?.trim();
  if (!apiKey) return null;
  const url = new URL(OMDB_API);
  url.searchParams.set("apikey", apiKey);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, String(value));
  }
  const payload = await fetchJson(url);
  return payload.Response === "False" ? null : payload;
}

async function fetchJson(url, init = {}) {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(20_000),
    headers: { "user-agent": "frameline-daily-poster/1.0", ...init.headers },
  });
  if (!response.ok) {
    throw new Error(`请求失败 ${response.status}：${redactUrl(url)}`);
  }
  return response.json();
}

function redactUrl(value) {
  const url = new URL(value);
  for (const key of ["api_key", "apikey"]) {
    if (url.searchParams.has(key)) url.searchParams.set(key, "[redacted]");
  }
  return url.toString();
}

async function findTmdbMovie(query) {
  const search = await tmdbGet("/search/movie", {
    query,
    language: "zh-CN",
    include_adult: false,
  });
  let candidate = [...(search.results ?? [])].sort(
    (left, right) =>
      scoreTmdbCandidate(right, query) - scoreTmdbCandidate(left, query),
  )[0];

  if (!candidate) {
    const omdb = await omdbGet({ t: query, type: "movie", plot: "short" });
    if (omdb?.imdbID) {
      const found = await tmdbGet(`/find/${omdb.imdbID}`, {
        external_source: "imdb_id",
        language: "zh-CN",
      });
      candidate = found.movie_results?.[0];
    }
  }
  if (!candidate) throw new Error(`TMDB 找不到电影：${query}`);

  return tmdbGet(`/movie/${candidate.id}`, {
    language: "zh-CN",
    append_to_response: "credits,images",
    include_image_language: "zh,null,en",
  });
}

function chooseBackdrop(details) {
  const backdrops = [...(details.images?.backdrops ?? [])].sort((left, right) => {
    const leftScore = (left.vote_average || 0) + Math.log10((left.vote_count || 0) + 1);
    const rightScore = (right.vote_average || 0) + Math.log10((right.vote_count || 0) + 1);
    return rightScore - leftScore;
  });
  const path = backdrops[0]?.file_path || details.backdrop_path;
  return path ? `${TMDB_IMAGE}${path}` : null;
}

async function resolveMovie(query) {
  const details = await findTmdbMovie(query);
  const omdb = details.imdb_id
    ? await omdbGet({ i: details.imdb_id, plot: "short" })
    : await omdbGet({ t: details.original_title || query, type: "movie" });
  const tmdbDirector = details.credits?.crew?.find(
    (person) => person.job === "Director",
  )?.name;
  const stillUrl = chooseBackdrop(details) || omdb?.Poster;
  if (!stillUrl || stillUrl === "N/A") {
    throw new Error(`电影“${query}”没有可用的 TMDB 剧照或 OMDb 海报`);
  }

  return {
    title: details.title || query,
    originalTitle: details.original_title || omdb?.Title || query,
    director: tmdbDirector || omdb?.Director || "未知导演",
    year: String(details.release_date || omdb?.Year || "").slice(0, 4) || "—",
    stillUrl,
    tmdbUrl: `https://www.themoviedb.org/movie/${details.id}?language=zh-CN`,
    imdbId: details.imdb_id || omdb?.imdbID || null,
  };
}

function chineseDay(day) {
  const numerals = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
  const number = Number(day);
  if (number <= 10) return numerals[number];
  if (number < 20) return `十${numerals[number - 10]}`;
  if (number === 20) return "二十";
  if (number < 30) return `廿${numerals[number - 20]}`;
  return number === 30 ? "三十" : String(day);
}

export function dateParts(isoDate) {
  const date = new Date(`${isoDate}T12:00:00+08:00`);
  if (Number.isNaN(date.getTime())) throw new Error(`无效日期：${isoDate}`);
  const english = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    month: "long",
    day: "2-digit",
    weekday: "long",
  }).formatToParts(date);
  const englishPart = (type) => english.find((item) => item.type === type)?.value;

  const lunar = new Intl.DateTimeFormat("zh-CN-u-ca-chinese", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).formatToParts(date);
  const lunarPart = (type) => lunar.find((item) => item.type === type)?.value || "";

  return {
    iso: isoDate,
    month: englishPart("month").toUpperCase(),
    day: englishPart("day"),
    weekday: englishPart("weekday").toUpperCase(),
    lunar: `${lunarPart("yearName")}年${lunarPart("month")}${chineseDay(lunarPart("day"))}`,
  };
}

async function embedImage(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`图片下载失败 ${response.status}：${url}`);
  const mime = response.headers.get("content-type") || "image/jpeg";
  const bytes = Buffer.from(await response.arrayBuffer());
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

async function resolveConfiguredImage(value, configPath) {
  if (!value) return null;
  if (/^(?:https?:|data:)/i.test(value)) return value;
  const filePath = resolve(dirname(configPath), value);
  if (!existsSync(filePath)) return null;
  return pathToFileURL(filePath).href;
}

function descriptionLines(value) {
  if (Array.isArray(value)) {
    return value.map((line) => String(line).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n|\|/)
      .map((line) => line.trim())
      .filter(Boolean);
  }
  return [];
}

export async function generate(options) {
  const config = await loadPosterConfig(options.config);
  const appearanceConfig = config.appearance || {};
  const headerConfig = config.header || {};
  const brandConfig = config.brand || {};
  const qrConfig = config.qr || {};
  const quotes = await fetchJson(QUOTE_URL);
  const quote = selectQuote(
    quotes,
    options.date,
    options.quoteId,
    options.demo,
  );
  const query = String(quote.from).replace(/^[《〈]|[》〉]$/g, "").trim();
  const movie = options.demo ? { ...DEMO_MOVIE } : await resolveMovie(query);
  if (options.embedImage) movie.stillUrl = await embedImage(movie.stillUrl);

  const qrTarget = options.qrUrl || qrConfig.target || movie.tmdbUrl;
  const configuredQr = await resolveConfiguredImage(qrConfig.image, options.config);
  const qrImageUrl =
    configuredQr ||
    (await QRCode.toDataURL(qrTarget, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 256,
      color: { dark: "#111111", light: "#ffffff" },
    }));
  const logoUrl = await resolveConfiguredImage(brandConfig.logo, options.config);

  return {
    appearance: {
      grayBackground: appearanceConfig.grayBackground !== false,
    },
    header: {
      slogan: headerConfig.slogan ?? "A FILM FOR EVERY DAY",
    },
    date: dateParts(options.date),
    quote: {
      text: quote.hitokoto,
      source: query,
      speaker: quote.from_who || null,
      id: quote.id,
    },
    movie,
    brand: {
      name: process.env.DAILY_POSTER_BRAND || brandConfig.name || "FRAME/LINE",
      tagline:
        process.env.DAILY_POSTER_TAGLINE ||
        brandConfig.tagline ||
        "A FILM FOR EVERY DAY",
      logoUrl,
    },
    qr: {
      target: qrTarget,
      slogan: qrConfig.slogan ?? qrConfig.label ?? "SCAN TO DISCOVER",
      description: descriptionLines(qrConfig.description),
      imageUrl: qrImageUrl,
      monochrome: Boolean(qrConfig.monochrome),
    },
    sources: {
      quote: QUOTE_URL,
      image: movie.stillUrl.startsWith("https://image.tmdb.org") ? "TMDB" : "OMDb",
      metadata: options.demo || process.env.OMDB_API_KEY ? "TMDB + OMDb" : "TMDB",
    },
  };
}

export async function main(argv = process.argv.slice(2)) {
  loadWorkspaceEnv();
  const options = parseArgs(argv);
  const output = await generate(options);
  await writeFile(options.out, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  process.stdout.write(
    `${JSON.stringify({ success: true, out: options.out, movie: output.movie.title, quoteId: output.quote.id })}\n`,
  );
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
