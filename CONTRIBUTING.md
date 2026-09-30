# Contributing to flashyos-spec

## The most useful thing you can send

**An implementation that disagrees with ours about a refusal.** Two
implementations that have never met agreeing about what to reject is the only
real evidence a specification says what it means. If yours rejects a document
ours accepts, that is a finding and we want it — open an issue with the
document and both verdicts.

Everything else is welcome too: bug reports, failing test cases, documentation
that was wrong, and code.

## Sign-off, not a licence assignment

We use the [Developer Certificate of Origin](https://developercertificate.org).
Sign your commits with `git commit -s`, which appends:

    Signed-off-by: Your Name <you@example.com>

That is the whole bar. **There is no CLA and you do not assign copyright to
anybody.** A contributor licence agreement is a negotiation, and asking for one
is how a project with four contributors stays a project with four
contributors.

## Before you open a pull request

> **Planned — not present until the format packages are migrated.** There is no
> `package.json` and no test harness in this repository yet, so the two
> commands below are not runnable today; they are how contributions will be
> checked once the packages land (see the README's *Status* section). Until
> then this repository carries the licence, the security policy and the
> direction, and its one live check is the shell-honesty test that keeps these
> docs from claiming otherwise (`node --test test/honesty.test.mjs`).

<!-- planned -->
```bash
npm ci
npm test
```

A test that reads prose punishes an explanation, so assert on behaviour rather
than on a file containing a string. And every walk carries a guard against
resolving nothing: a traversal that finds no files reports a clean repository
and reads exactly like one.

## What gets a pull request rejected

Nothing, silently. If a change is not right for this repository you get a
reason, and the reason is on the pull request where the next person can read
it.
