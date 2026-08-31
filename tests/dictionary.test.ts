import assert from "node:assert/strict";
import test from "node:test";
import {
  hasBundledDictionaryConflict,
  parseDictionaryInput,
} from "../src/lib/dictionary/input";

const valid = {
  word: "Yeni kelime",
  aliases: ["Yeni söyleyiş"],
  definition: "Kıbrıs ağzında kullanılan örnek bir anlam.",
  example: "Yeni kelimeyi köyde sıkça duyardık.",
  category: "günlük",
  rights_confirmed: true,
  website: "",
};

test("dictionary input is trimmed and gets a Turkish search key", () => {
  const result = parseDictionaryInput({
    ...valid,
    word: "  IĞDIR’da   Şölen! ",
    aliases: [" ŞÖLEN sözü ", "şölen   sözü", "Iğdır'da şölen"],
  });

  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.value.word, "IĞDIR’da Şölen!");
  assert.equal(result.value.normalizedKey, "igdir da solen");
  assert.deepEqual(result.value.aliases, ["ŞÖLEN sözü"]);
});

test("dictionary input requires an aliases array with no more than six items", () => {
  assert.equal(parseDictionaryInput({ ...valid, aliases: "tek alias" }).ok, false);
  assert.equal(
    parseDictionaryInput({
      ...valid,
      aliases: ["aa", "bb", "cc", "dd", "ee", "ff", "gg"],
    }).ok,
    false
  );
});

test("dictionary input fails closed for honeypots, missing rights, and invalid categories", () => {
  assert.equal(parseDictionaryInput({ ...valid, website: "spam.example" }).ok, false);
  assert.equal(parseDictionaryInput({ ...valid, rights_confirmed: false }).ok, false);
  assert.equal(parseDictionaryInput({ ...valid, category: "başka" }).ok, false);
});

test("dictionary input enforces text limits and rejects control-only words", () => {
  assert.equal(parseDictionaryInput({ ...valid, word: "!!" }).ok, false);
  assert.equal(parseDictionaryInput({ ...valid, definition: "x".repeat(601) }).ok, false);
  assert.equal(parseDictionaryInput({ ...valid, example: "x".repeat(401) }).ok, false);
  assert.equal(parseDictionaryInput({ ...valid, word: "Yeni\u202ekelime" }).ok, false);
});

test("bundled main words and aliases cannot be submitted again", () => {
  const mainWord = parseDictionaryInput({ ...valid, word: "Babuç", aliases: [] });
  assert.equal(mainWord.ok, true);
  if (mainWord.ok) assert.equal(hasBundledDictionaryConflict(mainWord.value), true);

  const bundledAlias = parseDictionaryInput({ ...valid, word: "Babiç", aliases: [] });
  assert.equal(bundledAlias.ok, true);
  if (bundledAlias.ok) assert.equal(hasBundledDictionaryConflict(bundledAlias.value), true);

  const newWord = parseDictionaryInput(valid);
  assert.equal(newWord.ok, true);
  if (newWord.ok) assert.equal(hasBundledDictionaryConflict(newWord.value), false);
});
