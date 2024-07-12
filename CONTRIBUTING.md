# Contributing To Compa

Hey! Thanks for considering contributing to Compa. As you already know, Compa is an open-source project and relies on contributions from people like _you_ to function.

Pull requests, bug reports or documentation updates (and all other forms of contributions) are welcome.

## Content

- [Code of Conduct](#code-of-conduct)  
- [Bug Reports](#bug-reports)  
- [Feature Requests](#feature-requests)  
- [School Requests](#school-requests)  
- [Pull Requests](#pull-requests)  
- [Writing Good Commit Messages](#writing-good-commit-messages)  
- [Credits](#credits)  

## Code of Conduct

Similar to other open-source communities, we have a [Code of Conduct](https://compa.so/code-of-conduct) which we expect all contributors to follow. In simple terms, don't be an asshole, it will not be tolerated.

## Bug Reports

If you find a bug, please open an issue with the title: `Bug: <Short Description>`. Make sure to include the following:

- A clear and descriptive title
- A detailed description of the bug
- Steps to reproduce the bug
- What you expected to happen
- What actually happened

If you can, include screenshots or videos of the bug. This will help us understand the issue better.

## Feature Requests

Before you make a feature request, consider our scope. Compa wants to give higher education students easy access to resources they need. Resources can be lesson notes, communities of people similar to them and so much more. Your idea may be amazing, make sure it's also within scope.

- Describe how the feature would match our vision
- Include implementation details/ideas if possible
- Search for similar feature requests first and avoid opening duplicates.

## School Requests

If you'd like to set up Compa for your school, please create an issue with the title: `School Request: <School Name>`.

## Pull Requests

It's best to open an issue to discuss the changes or your intended approach for an existing issue. Afterwards, you can link the PR and issue. If you submit a large PR without prior communication, it's unlikely to be accepted.

### Pull Request Tips

- **Keep PRs small and focused**. A PR per feature or fix is best. Don't refactor or change code unrelated to your issue. Enormous PRs may be rejected.

- **Prefer simple code over clever code**. Unless the cleverness is required, in that case, add a comment explaining **why** and **what** the code does.

- **Add tests when possible**. Follow the existing patterns for tests.

- **Use the recommended formatter**. We've already setup a formatting style as well as recommended extensions to use. Use what is setup.

- **Resolve merge conflicts**.

- **Fix CI/CD failures ASAP**. PRs that cause build failures or fail tests will be rejected.

### PR Flow

1. Fork the repository and clone it to your local machine
2. Create a new branch with a descriptive name
3. Make your changes
4. Push your changes to your fork
5. Open a PR

## Writing Good Commit Messages

![(https://xkcd.com/1296/)](https://imgs.xkcd.com/comics/git_commit.png)

Please write a good commit message. Follow these guidelines:

1. Separate subject from body with a blank line
2. Limit the subject line to 50 characters
3. Capitalize the subject line
4. Do not end the subject line with a period
5. Use the imperative mood in the subject line (example: "Fix networking issue").  
Imperative means the message should sound like a command.
6. Wrap the body at about 72 characters
7. Use the body to explain why, not what and how (the code shows that!)

A good subject line would complete this sentence:  

`If applied, this commit will <your subject line here>`

**Example:**

```plaintext

Add CONTRIBUTING.md

Add a more detailed explanation here, if necessary.

Wrap the body to about 72 characters. It's easier to read. Also,
ensure there's a blank line between subject and body.

Explain what the commit is solving and *why*. The why helps reviewers
and future you understand the reasoning behind the changes.

- Bullet points are fine.

- Use a hyphen and keep a blank line between bullets.
```

For more info, read [this.](https://cbea.ms/git-commit/)

## Credits

Written by [@henrychris](https://github.com/henrychris).
These were the main inspirations for this document:

- [jessesquires](https://github.com/jessesquires/.github/blob/main/CONTRIBUTING.md)
- [moby](https://github.com/moby/moby/blob/master/CONTRIBUTING.md)
- [auth0](https://github.com/auth0/open-source-template/blob/master/GENERAL-CONTRIBUTING.md)
