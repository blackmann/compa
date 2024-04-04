# compa client

## Common dev issues

When you see an error like below when running `yarn dev`:

```
Error: Could not load the "sharp" module using the darwin-arm64 runtime
```

Run the following command to remedy it:

```sh
yarn workspace client add sharp --ignore-engines
```
