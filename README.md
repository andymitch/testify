# Monorepo Test Converage Example
[![PR coverage](https://github.com/andymitch/testify/actions/workflows/pr-coverage.yml/badge.svg)](https://github.com/andymitch/testify/actions/workflows/pr-coverage.yml)

This is a simple example of a monorepo containing multiple projects with jest tests. It also includes:
- a GitHub Action to run tests pertaining to the PR's diff and block pull requests if they fail
- `husky` to run tests pertaining to changed code locally before a `git push`

__NOTE:__ To keep this example simple, and what should be considered for all modern JS/TS monorepos, this repo is setup up as NPM workspaces to simplify dependency management. The primary reason for using workspaces in this context is to ensure your projects' dependencies are available when running tests globally. ___Warning:__ If you decide to not use workspaces in your monorepo, your implementation will differ slightly._

## Jest Configuration

Both Husky and the GitHub Action will run jest which is configured in `package.json`. You can still run jest manually either at the global level (all projects) or within the projects themselves as normal.

## Husky Testing

Husky was added to validate code at the local level. It will run any jest tests that cover any code changes and will count against coverage for any code changes that aren't covered by tests. If coverage is below `"jest"."coverageThreshold"` in `package.json`, coverage will fail and you won't be able to commit code. This is all highly configurable in `.husky/pre-commit` because it is essentially just a hook for commands to run, allowing the git operation if and only if you don't get an `exit 1` from your commands (ie. your tests pass). You can also change the file name to (or add a new file named) `.husky/pre-push` to run the tests before pushing code. Additional hook options can be found in `.husky/_/`.

## GitHub Action Testing

The GitHub Action will run all jest tests in the monorepo on every pull request. This is also highly configurable in `.github/workflows/test-coverage.yml`. It's currently configured to only test changes between `HEAD..origin/<target-branch>` but can be configured to test the entire quite be removing the flag `--changedSince=origin/${{ github.base_ref }}`. If any tests fail, the action will fail and a report will be commented on the PR. The action is currently triggered on `pull_request` events targeting the `main` branch.

## Conclusion

- Husky will test any imediate code changes using the jest flag `--onlyChanged` and block commits with insufficient coverage.
- GitHub Action will test any changes between the head branch and the target branch and block merging a PR with insufficient coverage.
- If any changes are made that jest doesn not normally cover (ie. README, sql migrations, etc.), it will not count against your total coverage.

## Quick Start DIY

1. Initialize your monorepo and install dependencies
```sh
npm init
npm install --save-dev husky jest
npx husky install
```

2.  Modify your `package.json` to setup Husky and workspaces
```jsonc
{
  // ...
  "private": true,
  "workspaces": [
    // ...list your node projects here
  ],
  "scripts": {
    "prepare": "husky install",
    // ...
  },
  "devDependencies": {
    "husky": "^9.1.7",
    "jest": "^29.7.0"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": [
      "/node_modules/"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
```

3. Add the following to your husky hook command in `.husky/pre-commit` (create it if it wasn't generated)
```
npx jest --coverage --onlyChanged --passWithNoTests --coverageDirectory=/tmp/coverage
```

4. Reinstall your dependencies
  - delete any `node_modules` directories in your monorepo for projects you want to include as a workspace
  - at your moonorepo level: `npm install` (this will maintain all your dependencies at the root level now)

6. Add your GitHub Action workflow: `.github/workflows/pr-coverage.yml`
```yml
name: "PR Coverage"
on:
  pull_request:
    types:
      - opened
      - synchronize
    branches:
      - main
      # - dev, etc.

jobs:
  pr-coverage-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - name: Install dependencies
        run: npm ci
      - name: Run Jest coverage for changed files
        run: npx jest --coverage --changedSince=origin/${{ github.base_ref }} --passWithNoTests --coverageDirectory=$RUNNER_TEMP/coverage
```

6. Verify your tests pass from your monorepo
```sh
npx jest --coverage
```

5. Try committing and submitting a PR to verify Husky and your GitHub Action are working
