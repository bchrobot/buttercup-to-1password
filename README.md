[![npm](https://img.shields.io/npm/v/buttercup-to-1password)](https://www.npmjs.com/package/buttercup-to-1password) ![GitHub](https://img.shields.io/github/license/bchrobot/buttercup-to-1password)

# bc2op

A CLI for migrating from Buttercup to 1Password.

## Getting Started

Install the [1Password CLI](https://support.1password.com/command-line-getting-started/) and then authenticate to give your account a shorthand identifier:

```sh
op signin myshorthand.1password.com wendy_appleseed@example.com
```

Install `bc2op`:

```sh
npm i -g buttercup-to-1password
```

Export your password from Buttercup to a CSV and then migrate with `bc2op`:

```sh
bc2op --shorthand=myshorthand /path/to/buttercup-export.csv
```

## Usage

```
bc2op --help

> Migrate password entires from Buttercup export to 1Password

ARGUMENTS:
  <export> - The Buttercup CSV export

OPTIONS:
  --shorthand, -s <str> - Shorthand name for 1Password account
  --mode, -m <value>    - How to handle converting Buttercup groups to 1Password tags. [optional]

FLAGS:
  --dry-run, -d - Print payloads instead of persisting to 1Password
  --help, -h    - show help
  --version, -v - print the version
```
