[![coverage](https://github.com/andymitch/testify/actions/workflows/test-coverage.yml/badge.svg)](https://github.com/andymitch/testify/actions/workflows/test-coverage.yml)

# Test Converage Example

This is a simple example of a monorepo containing multiple projects with jest tests and a GitHub Action to run them and block pull requests if the tests fail. This also uses `husky` to run the tests before pushing code.

## Husky Testing

Husky will run all jest tests before allowing a git push. If any tests fail, the push will be blocked. This is highly configurable in `.husky/pre-push` because it is essentially just a hook for a shell script to run, allowing the git operation iff you don't get an `exit 1` from your commands (ie. your tests passed). You can also change the file name to (or add a new file named) `.husky/pre-commit` to run the tests before committing code.

## GitHub Action Testing

The GitHub Action will run all jest tests in the monorepo on every pull request. This is also highly configurable in `.github/workflows/test-coverage.yml`. If any tests fail, the action will fail and a report will be commented on the PR. The action is currently triggered on `pull_request` events to `main`
