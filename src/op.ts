import shell from "shelljs";
import cloneDeep from "lodash/cloneDeep";
import sortBy from "lodash/sortBy";
import omit from "lodash/omit";
import { ButtercupRow, TagMapping } from "./buttercup";
import { randomString } from "./util";

export interface Vault {
  name: string;
  uuid: string;
}

export interface LoginSectionField {
  k: "string";
  t: string;
  v: string;
  n: string;
}

export interface LoginSection {
  name: string;
  title: string;
  fields: LoginSectionField[];
}

export interface Login {
  fields: {
    designation: "username" | "password";
    name: string;
    type: "T" | "P";
    value: string;
  }[];
  notesPlain: string;
  passwordHistory: any[];
  sections: LoginSection[];
}

// Generated from `op get template login`
const LOGIN_TEMPLATE: Login = {
  fields: [
    { designation: "username", name: "username", type: "T", value: "" },
    { designation: "password", name: "password", type: "P", value: "" },
  ],
  notesPlain: "",
  passwordHistory: [],
  sections: [],
};

export const authOp = (shorthand: string, password: string): void => {
  const session = shell
    .ShellString(password)
    .exec(`op signin ${shorthand} --raw`, { silent: true });

  if (session.code !== 0) throw new Error(session.stderr);

  shell.env[`OP_SESSION_${shorthand}`] = session.stdout.trim();
};

export const getVaults = (): Vault[] =>
  sortBy(JSON.parse(shell.exec(`op list vaults`, { silent: true }).stdout), [
    "name",
  ]);

export const rowToEntry = (row: ButtercupRow, _mapping: TagMapping): Login => {
  const draft = cloneDeep(LOGIN_TEMPLATE);

  const { username, password, ...otherFields } = omit<
    ButtercupRow,
    "!type" | "!group_id" | "!group_name" | "!group_parent" | "id"
  >(row, ["!type", "!group_id", "!group_name", "!group_parent"]);

  // Update username/password
  const usernameField = draft.fields.find(
    ({ designation }) => designation === "username"
  );
  if (usernameField) usernameField.value = username;
  const passwordField = draft.fields.find(
    ({ designation }) => designation === "password"
  );
  if (passwordField) passwordField.value = password;

  // Add entries
  draft.sections.push({
    name: "other",
    title: "Other",
    fields: Object.entries(otherFields)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => ({
        k: "string",
        t: key,
        v: value,
        n: randomString(32, "#A"),
      })),
  });

  return draft;
};

export const createLogin = (
  login: Login,
  title: string,
  vaultUuid: string
): void => {
  const payload = shell
    .ShellString(JSON.stringify(login))
    .exec(`op encode`, { silent: true })
    .stdout.trim();
  shell.exec(
    `op create item login ${payload} --title="${title}" --vault=${vaultUuid}`
  );
};
