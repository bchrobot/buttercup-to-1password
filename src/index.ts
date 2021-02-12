import Prompt from "prompt-sync";
import { parseExportSync, buildTagMappings } from "./buttercup";
import { authOp, getVaults, rowToEntry, createLogin } from "./op";

const prompt = Prompt({ sigint: true });

const promptOpAuth = (shorthand: string) => {
  const vaultPassword = prompt("1Password password: ");
  authOp(shorthand, vaultPassword);
};

const promptVault = () => {
  const vaults = getVaults();
  vaults.forEach((vault, i) => {
    process.stdout.write(`[${i}] ${vault.name}\n`);
  });
  const vaultIndex =
    parseInt(prompt("Please choose the destination Vault [0]: ")) || 0;
  const vaultUuid = vaults[vaultIndex].uuid;
  return vaultUuid;
};

export interface MigrateLoginOptions {
  exportPath: string;
  accountShorthand: string;
  dryrun: boolean;
}

export const migrateLogins = (options: MigrateLoginOptions): void => {
  const { exportPath, accountShorthand, dryrun } = options;

  // Parse Buttercup export
  const { groups, entries } = parseExportSync(exportPath);
  const tagMappings = buildTagMappings(groups);
  const logins = entries.map((row) => ({
    title: row.title,
    login: rowToEntry(row, tagMappings),
  }));

  // Configure 1Password target
  promptOpAuth(accountShorthand);
  const vaultUuid = promptVault();

  // Migrate the logins
  for (const { title, login } of logins) {
    if (dryrun) {
      console.log(title, login);
    } else {
      createLogin(login, title, vaultUuid);
    }
  }
};
