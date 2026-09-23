# flashyos-spec

```
        ██
       ██
      ██████
        ██
       ██
      ██
```

**The formats, their schemas, and the corpora that settle arguments about them.**

Apache-2.0 specifications for organisational accountability on the agentic web: who is accountable, which lanes an organisation opens, what shipped, and what a stranger may verify offline. Every format ships a conformance corpus as data — and most of every corpus is refusals.

> **Not released yet.** Carried out of a private monorepo with its real history, which is a decision rather than a build.
>
> Everything below is the design and the reasoning. The code lands before
> this repository is tagged, and the version stays at 0.0.0 until it does.

## Using it

Nothing to install. One fetch enumerates every format, its package, its
JSON Schema and its corpus:

```bash
curl -s https://flashyos.com/.well-known/specs.json | jq -r '.profiles[].profile'
# aao/0.1
# backlog/1
# checkpoint/1
# directory/1
# flashyos/1
# frontdoor/1
# shipped/1
# …

curl -s https://flashyos.com/.well-known/conformance/frontdoor-1.json \
  | jq '.sets[0] | {accept, refuse}'
# { "accept": 5, "refuse": 22 }
```

## The invariants

Everything here follows from these. Each is enforced by something rather
than promised, because a rule with nothing behind it erodes one
convenience at a time.

| Invariant | Why | Enforced by |
| --- | --- | --- |
| **The refusals are the substance** | Any implementation accepts a valid document; disagreement lives in what must be rejected | 22 of `frontdoor/1`’s 27 vectors are refusals, each naming one rule |
| **Verification never requires us** | A format whose checking needs its author’s service is one you should refuse | The verifier is offline, with no account and no network call |
| **A published file proves control of a host** | It does not prove an organisation is who it says it is, and the difference is the whole point | The caution is normative and a validator rejects a document that alters it |
| **A derived field may never be asserted** | A caller who could write one could claim a fact nothing computed | Refused by name in the validator as well as the writer |
| **A correction is appended, never edited** | History you can edit is not evidence | `revise` and superseding entries; the original stays |

## It works alone

No account, no API key, no telemetry, and no network call unless you ask
for one. If anything here ever needs a service of ours to answer, that is a
bug — you would be right to refuse a checker with a dependency on the party
being checked.

## What flashyos-spec is not

- **Not a competitor to A2A, MCP or agents.txt.** Those settled the capability layer and left accountability explicitly out of scope. This is that layer, and it points at theirs rather than restating it.
- **Not a registry.** The formats are free and forkable. What a registry adds — re-verification over time — is a service, and it is not what this repository is.
- **Not adopted.** As at this commit, no organisation outside the estate that wrote these has been verified serving one. That number is published rather than rounded up.

## Status

**The specifications are not here yet.** They are Apache-2.0 today
and served at the URLs above; carrying the packages out of the monorepo they
were written in, *with their real commit history*, is a deliberate operation
rather than a copy — a chain of title that begins on the day somebody
remembered to copy the files is not a chain of title. Until that runs, this
repository is the licence, the security policy and the direction.

## Contributing

**The most useful thing you can send is an implementation that disagrees
with ours about a refusal.** Two implementations that have never met,
agreeing about what to reject, is the only real evidence a specification
says what it means.

Sign-off rather than a copyright assignment — see
[CONTRIBUTING.md](CONTRIBUTING.md). There is no CLA.

## Licence

[Apache-2.0](LICENSE), copyright Flashy Labs. The rules are open and the
tooling is open; fork either, and check ours against yours.

## The formats these were written for

Published, machine-readable, and implementable without installing anything:

```bash
curl -s https://flashyos.com/.well-known/specs.json | jq .
```
