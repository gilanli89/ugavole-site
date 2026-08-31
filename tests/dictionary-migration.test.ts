import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../supabase/migrations/005_dictionary_entries.sql",
  import.meta.url
);

test("dictionary migration keeps public reads on the published-only view", async () => {
  const sql = await readFile(migrationUrl, "utf8");
  const executableSql = sql.replace(/--.*$/gm, "");

  assert.match(
    sql,
    /create or replace view public\.published_dictionary_entries[\s\S]*where status = 'published' and published_at is not null;/
  );
  assert.match(
    sql,
    /grant select on public\.published_dictionary_entries to anon, authenticated;/
  );
  assert.doesNotMatch(sql, /grant select on public\.dictionary_entries to anon/);
  assert.doesNotMatch(executableSql, /content_items|published_content/);
});

test("dictionary submission is service-role-only, atomic, and active-key unique", async () => {
  const sql = await readFile(migrationUrl, "utf8");

  assert.match(sql, /create unique index[^;]+dictionary_entries_active_key_unique[\s\S]*status in \('pending', 'in_review', 'published'\);/);
  assert.match(sql, /array_agg\(candidate\.key order by candidate\.key\)/);
  assert.match(sql, /foreach proposed_key in array proposed_keys loop[\s\S]*pg_advisory_xact_lock\(hashtextextended\(proposed_key, 1\)\)/);
  assert.match(sql, /unnest\(existing\.aliases\)[\s\S]*dictionary_normalized_key\(alias\) = any\(proposed_keys\)/);
  assert.match(sql, /raise exception 'dictionary_entry_already_active'/);
  assert.match(
    sql,
    /grant execute on function public\.submit_dictionary_entry\([\s\S]*\) to service_role;/
  );
});

test("dictionary moderation and retention fail closed", async () => {
  const sql = await readFile(migrationUrl, "utf8");

  assert.match(sql, /if not public\.is_staff_aal2\(\) then/);
  assert.match(
    sql,
    /grant execute on function public\.moderate_dictionary_entry\(uuid, integer, text, text\)[\s\S]*to authenticated;/
  );
  assert.match(sql, /create or replace function public\.cleanup_dictionary_retention/);
  assert.match(sql, /auth\.role\(\) <> 'service_role'/);
});

test("published community entries require AAL2 and a note to unpublish", async () => {
  const sql = await readFile(migrationUrl, "utf8");

  assert.match(
    sql,
    /action in \('submitted', 'review', 'publish', 'reject', 'unpublish'\)/
  );
  assert.match(
    sql,
    /when 'unpublish' then[\s\S]*item\.status <> 'published'[\s\S]*dictionary_unpublish_note_required[\s\S]*target_status := 'rejected'/
  );
  assert.match(
    sql,
    /published_at = case when target_status = 'published' then now\(\) else null end/
  );
});
