import assert from "node:assert/strict";
import test from "node:test";
import {
  dateParts,
  hashString,
  normalizeTitle,
  scoreTmdbCandidate,
  selectQuote,
} from "./generate-daily-movie.mjs";

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
