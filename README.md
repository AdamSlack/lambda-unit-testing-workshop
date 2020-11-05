# lambda-unit-testing-workshop

This repo provides a simple example lambda implemented using typescript, using Middy to provide some basic validation and other utilities.

## What should you do?

You should aim to get 100% test covereage and 0 mutations!

## How can i do that?

Finish off writing unit tests for the lambda that is only partially tested!

## How can i check my progress?

There are two things to check:
- For unit tests and coverage run: `yarn test`
- For Mutation tests and results run: `yarn test:mutate`

## What is Mutation Testing?

Mutation Testing aims to prove that the quality of your code coverage is sufficient. It does this tweaking elements of the codebase before running the suite of unit tests.

If no unit tests fail for a particular change, then that is flagged as a mutant. Mutants indicate an aspect of the code base that was not sufficiently tested.

## How can i squash mutants?

By writing more tests! If you find that `stryker` is complaining about a particular line, then there is likely some tests and assertions missing.

## Setup

1. Run a `yarn install`
2. run a `yarn test` to validate dependencies are installed and tests can be run
3. run a `yarn test:mutate` to validate mutation testing can take place

You might need to install yarn and stryker separately, but you shouldn't do.

- Link to [Stryker Mutator](https://stryker-mutator.io/)
- Link to [Yarn](https://classic.yarnpkg.com/en/)

You could just use `npm`, whatever you prefer.