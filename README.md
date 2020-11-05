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

Mutation Testing aims to prove that the quality of your code coverage is sufficient. It does this by changing elements of the codebase before running the suite of unit tests.

If no unit tests fail for a particular change, then that is flagged as a mutant. Mutants indicate an aspect of the code base that was not sufficiently tested.

Typical things that are subject to being mutated includes such things as:
- Objects and values passed to functions
- Operators (e.g. `>`, `<=`, etc)
- String literals

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

# Principles for testing lambda

The following is a set of general guidelines that can be applied to your testing of lambda. Like with all things software engineering, a degree of pragmatism is required should you apply these to your own lambda testing approaches.


## Test your lambda through the front door.

> Excercise the lambda in the same way as it is going to be used in a deployed environment.

Testing is all about proving that your code works. You need to be able to state with confidence that what you have implemented will behave as expected in a 'production' environment.

A challenge with many forms of testing is having confidence that what works locally "on your machine" will still work when deployed into a different environment. Writing tests that mimic reality improve the likelihood that your will work as it should

By only writing unit tests that 'go through the front door' you are ensuring that all your tests replicate the reality of how your lambda functions are to be used.

Whether it is Via API Gateway, SNS, SQS, or any other integration, your lambda is always invoked in the same way - A Handler is executed with some payload.

## Assert at the boundaries.

> Mocking that which is external to your lambda, make assertions against those boundaries

Mocking the interactions that are external to you lambda means that you can validate the behavior of your code under a range of different circumstances. You can then make assertions that your lambda initiates, or responds to these interactions as you expect.

As small and discrete packages of business logic there is little value in testing the 'internals' of the lambda in isolation. Which is to say, producing excessive mocks and for code that is packaged and deployed with your lambda does not help in proving that your lambda behaves as it should.

Example External interactions to Mock:
- Making a http request
- Pushing a message onto SQS
- Querying DynamoDB
- Recording a Log
- Recording a CloudWatch Metric

Example Internal Interactions you want to avoid Mocking:
- Using an internal helper function
- Proxy Services for external interactions

## Complex Testing means Complex Lambda

> Complexity in tests is a good indicator of an overly complicated lambda

Should you find that producing a set of small and simple tests is becoming challenging, then you may wish to reconsider the implementation of your lambda. It is an indicator that your lambda is attempting to do too much.

Some Questions to ask yourself:
- Am i needing to heavily mock the internals to produce easy to understand unit tests?
- Are there just too many scenarios/behaviours to test?
- Am i struggling to cleanly mock all the externals to this lambda?
- Are there huge branches in the implementation?

Should you answer yes to any of those, then you might want to consider refactoring your lambda into separate functions. Each lambda should pick one thing, and do that one thing well!

Looking at other AWS Technologies could assist you with the task of producing simple Lambda Functions:
- SNS and subscription filtering on message attributes can be used to simplify branching logic. 
- Step Functions can simplify the implementation of workflows

## Treat your Lambda as an isolated unit.

> Treating your lambda as the smallest discrete testable unit shifts testing focus to more meaningful levels

Testing occurs at different levels, with different boundaries. Different teams call each level of testing something different, but generally go from small-in-scope unit tests, up to widely scoped e2e tests.

In a serverless architecture, the range of tools that are in use, and the complexity of the system can grow very rapidly. As such testing often focuses on your usage of various servless tools and their integration with each other.

By treating each lambda the smallest testable unit of code, you are able to able to start testing your usage of lambda much quicker, and begin testing the integration of your lambda functions with the rest of your estate.

This also allows you to test the behaviours of your lambda without coupling tests too tightly to their implementation. Refactoring the implementation is easier as you have tests validating that the end behaviour doesn't change. You can even begin to write the tests that descibe expected behaviours before beginning any implementation!

## One Assertion Per Test

> Testing one thing at a time makes it clearer what has failed

This isn't strictly a good rule for testing lambda, but best practice for all kinds of testing.

A Test typically follow the following steps:
1. Setup Scenario
2. Execute Scenario
3. Make Assertion
4. Teardown Scenario

Often tests are found to be making multiple assertions during the execution of a scenario. This can impeded development by making it difficult to see all which assertions passed and which failed, especially if your test runner stops a test after a single failing scenario.

With many common testing libraries like `jest` utilities are provided to help you repeat the setup and teardown and also make independant assertions of behaviours and interactions