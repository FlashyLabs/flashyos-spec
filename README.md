# flashyos-spec

**The formats, their schemas, and the corpora that settle arguments about them.**

Apache-2.0 specifications for organisational accountability on the agentic web: who is accountable, which lanes are open, what shipped, and what a stranger may verify offline. Every format ships a conformance corpus as data, most of it refusals.

> **Not released yet.** Carried out of a private monorepo with its real history, which is a decision rather than a build. The design and the reasoning are below;
> the code lands before this repository is tagged.

## Install

```bash
curl -s https://flashyos.com/.well-known/specs.json | jq .
```

## Why it exists

Everything here exists because of a defect that shipped somewhere real and
was not noticed. The failure mode these share is a confident wrong answer
rather than an error: nothing goes red, the number looks fine, and it is
acted on.

## It works alone

No account, no API key, no telemetry, and no network call unless you ask
for one. If a tool here ever needs a service of ours to answer, that is a
bug — you would be right to refuse a checker with a dependency on the party
being checked.

## Licence

Apache-2.0, copyright Flashy Labs. See [LICENSE](LICENSE).

## If you are here from a `$id` or a corpus

The formats these tools were written for are published, machine-readable and
implementable without installing anything:

```bash
curl -s https://flashyos.com/.well-known/specs.json | jq .
```
