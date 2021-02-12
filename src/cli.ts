#!/usr/bin/env node
import { command, run, string, positional, option, flag } from "cmd-ts";
import { File } from "cmd-ts/dist/cjs/batteries/fs";

import { migrateLogins } from "./index";

const cmd = command({
  name: "bc2op",
  description: "Migrate password entires from Buttercup export to 1Password",
  version: "0.1.0",
  args: {
    export: positional({
      type: File,
      displayName: "export",
      description: "The Buttercup CSV export",
    }),
    shorthand: option({
      short: "s",
      long: "shorthand",
      description: "Shorthand name for 1Password account",
      type: string,
    }),
    dryrun: flag({
      short: "d",
      long: "dry-run",
      description: "Print payloads instead of persisting to 1Password",
      defaultValue: () => false,
    }),
  },
  handler: ({ export: exportPath, shorthand: accountShorthand, dryrun }) => {
    migrateLogins({ exportPath, accountShorthand, dryrun });
  },
});

run(cmd, process.argv.slice(2));
