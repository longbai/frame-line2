import assert from "node:assert/strict";
import test from "node:test";
import {
  dateParts,
  hashString,
  normalizeTitle,
  scoreTmdbCandidate,
  selectQuote,
} from "./generate-daily-movie.mjs";
import {
  shanghaiTimestamp,
  timestampedOutputPaths,
} from "./render-daily-movie.mjs";

test("normalizes Chinese title punctuation", () => {
  assert.equal(normalizeTitle("《绿皮书》"), "绿皮书");
  assert.equal(normalizeTitle("Green Book"), "greenbook");
});

test("date selection is stable", () => {
  const quotes = [
    { id: 1, type: "h", hitokoto: "A", from: "Film A" },
    { id: 2, type: "h", hitokoto: "B", from: "Film B" },
  ];
  assert.equal(
    selectQuote(quotes, "2026-08-29").id,
    quotes[hashString("2026-08-29") % quotes.length].id,
  );
});

test("exact localized title ranks above a merely popular mismatch", () => {
  const exact = { title: "绿皮书", original_title: "Green Book", popularity: 1 };
  const popular = { title: "绿色星球", original_title: "Green Planet", popularity: 9999 };
  assert.ok(scoreTmdbCandidate(exact, "绿皮书") > scoreTmdbCandidate(popular, "绿皮书"));
});

test("formats English calendar and Chinese lunar date", () => {
  assert.deepEqual(dateParts("2026-08-29"), {
    iso: "2026-08-29",
    month: "AUGUST",
    day: "29",
    weekday: "SATURDAY",
    lunar: "丙午年七月十七",
  });
});

test("formats generation timestamps in Asia/Shanghai", () => {
  assert.equal(
    shanghaiTimestamp(new Date("2026-08-30T08:21:34.567Z")),
    "20260830-162134-567",
  );
});

test("adds the content date and generation timestamp to artifact names", () => {
  const output = timestampedOutputPaths(
    "2026-08-29",
    new Date("2026-08-30T08:21:34.567Z"),
    "/tmp/frame-line-output",
  );
  assert.equal(
    output.html,
    "/tmp/frame-line-output/daily-movie-2026-08-29_20260830-162134-567.html",
  );
  assert.equal(
    output.png,
    "/tmp/frame-line-output/daily-movie-2026-08-29_20260830-162134-567.png",
  );
});
