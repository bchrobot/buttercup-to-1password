# bc2op

A CLI for migrating from Buttercup to 1Password.

```
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
