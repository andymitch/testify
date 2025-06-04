# Monorepo Test Converage Example
[![PR coverage](https://github.com/andymitch/testify/actions/workflows/pr-coverage.yml/badge.svg)](https://github.com/andymitch/testify/actions/workflows/pr-coverage.yml)

This is a simple example of a monorepo containing multiple projects with jest tests. It also includes:
- a GitHub Action to run them and block pull requests if the tests fail
- `husky` to run tests pertaining to changed code before a `git push`

## Jest Configuration

Both Husky and the GitHub Action will run jest which is configured in `package.json`. You can still run jest manually either at the global level (all projects) or within the projects themselves.

## Husky Testing

Husky was added to validate code at the local level. It will run any jest tests that cover any code changes and will count against coverage for any code changes that aren't covered by tests. If coverage is below `"jest"."coverageThreshold"` in `package.json`, coverage will fail and you won't be able to commit code. This is all highly configurable in `.husky/pre-commit` because it is essentially just a hook for commands to run, allowing the git operation if and only if you don't get an `exit 1` from your commands (ie. your tests pass). You can also change the file name to (or add a new file named) `.husky/pre-push` to run the tests before pushing code. Additional hook options can be found in `.husky/_/`.

## GitHub Action Testing

The GitHub Action will run all jest tests in the monorepo on every pull request. This is also highly configurable in `.github/workflows/test-coverage.yml`. It's currently configured to only test changes between `HEAD..origin/<target-branch>` but can be configured to test the entire quite be removing the flag `--changedSince=origin/${{ github.base_ref }}`. If any tests fail, the action will fail and a report will be commented on the PR. The action is currently triggered on `pull_request` events targeting the `main` branch.

## Conclusion

- Husky will test any imediate code changes using the jest flag `--onlyChanged` and block commits with insufficient coverage.
- GitHub Action will test any changes between the head branch and the target branch and block merging a PR with insufficient coverage.
- If any changes are made that jest doesn not normally cover (ie. README, sql migrations, etc.), it will not count against your total coverage.
