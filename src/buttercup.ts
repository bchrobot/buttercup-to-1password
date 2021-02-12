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

export enum TagMode {
  Plain = "Plain",
  Indexed = "Indexed",
  Combined = "Combined",
}

const formatTags = (tags: string[], mode = TagMode.Plain) => {
  switch (mode) {
    case TagMode.Plain:
      return tags.reverse();
    case TagMode.Indexed:
      return tags.reverse().map((tag, i) => `${i}:${tag}`);
    case TagMode.Combined:
      return [tags.reverse().join("/")];
  }
};

export const buildTagMappings = (
  groups: ButtercupRow[],
  mode: TagMode
): TagMapping =>
  groups.reduce<TagMapping>((acc, group) => {
    const tags: string[] = [];
    let node: ButtercupRow | undefined = group;
    do {
      tags.push(node["!group_name"]);
      node = groups.find(
        (grp) => node && grp["!group_id"] === node["!group_parent"]
      );
    } while (node);
    acc[group["!group_id"]] = formatTags(tags, mode);
    return acc;
  }, {});
