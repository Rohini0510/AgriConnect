---
name: Shared client declaration freshness
description: Why frontend typechecks can miss newly generated API client exports in this workspace
---

After changing the OpenAPI contract or generated API surface, the frontend may resolve the shared client's stale declaration output instead of the current generated TypeScript source. Regenerating the client package declarations before checking the frontend restores the expected exports.

**Why:** The frontend uses the shared package through a TypeScript project reference, so an old declaration build can hide newly generated hooks and schemas even when the source generator output is correct.

**How to apply:** When a frontend import from `@workspace/api-client-react` is reported as missing after contract generation, regenerate the client package's declarations first, then rerun the frontend typecheck.