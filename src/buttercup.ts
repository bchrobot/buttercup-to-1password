import fs from "fs";
import parse from "csv-parse/lib/sync";
import partition from "lodash/partition";

export interface ButtercupRow {
  "!type": "group" | "entry";
  "!group_id": string;
  "!group_name": string;
  "!group_parent": string;
  title: string;
  username: string;
  password: string;
  [key: string]: string;
}

export type TagMapping = Record<string, string[]>;

export const parseExportSync = (
  path: string
): { groups: ButtercupRow[]; entries: ButtercupRow[] } => {
  const buttercupExport = fs.readFileSync(path);
  const rows: ButtercupRow[] = parse(buttercupExport, {
    columns: true,
    skip_empty_lines: true,
  });
  const [groups, entries] = partition(rows, { "!type": "group" });
  return { groups, entries };
};

export const buildTagMappings = (_groups: ButtercupRow[]): TagMapping => {
  return {};
};
