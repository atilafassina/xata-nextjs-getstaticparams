This is contrived issue reproduction between Next.js and Xata.

## Issue 🌋

When using Xata in a dynamic route with `getStaticParams` it will cause a runtime shift between first build and rebuilds. This happens because `incrementalCache` seems to switch values from first build.

> ❗️ Issue happens only in development

Deployed app: [xata-nextjs-getstaticparams.vercel.app](https://xata-nextjs-getstaticparams.vercel.app/)

### Workaround

Passing a hardcoded `next.revalidate` option on build will stick it to either dynamic or static.

<details>
    <summary>Dynamic</summary>
    
```ts
const xata = new XataClient({
    fetch: (path, options) => {
      return fetch(path, {
        ...options,
        next: {
          revalidate: false,
        },
      });
    },
  });
  ```

</details>
<details>
    <summary>Static</summary>

```ts
const xata = new XataClient({
  fetch: (path, options) => {
    return fetch(path, {
      ...options,
      next: {
        revalidate: 10,
      },
    });
  },
});
```

</details>
<details>
<summary>Environment Based</summary>

```ts
const xata = new XataClient({
  fetch: (path, options) => {
    return fetch(path, {
      ...options,
      next: {
        revalidate: process.env.NODE_ENV === "development" ? 0 : 60,
      },
    });
  },
});
```

</details>

The problem with the workaround is that the user will need to always generate their own instance instead of leveraging the codegen to its maximum potential.

## Ideal Solution

The SDK can uses the `fetch` instance from Next.js without needing to hardcode any default value.

## Run App

```sh
pnpm i && pnpm dev
```

Serves in [localhost:3000](http://localhost:3000)

### Environment Variable

This app requires a Xata account, once you have one add your [access token](https://xata.io/docs/getting-started/api-keys) to your `.env` or `.env.local` to run it locally.

```
XATA_API_KEY=<token>
```

### Database

The `.xatarc` carries the build configuration to your app. `codegen.output` will tell the CLI where to put the generated SDK code. While the `databaseURL` is your Database URL. You can generate it using the [Xata CLI](https://xata.io/docs/getting-started/installation), manually, or via the VS Code Extension.

> 💡 It is also possible to pass `--databaseUrl` and `--output` flags to the `xata:codegen` task and skip the `.xatarc` completely.

### Minimal Schema

**Posts**
| Column | Type |
| ------- | -------- |
| `id` | `string` |
| `slug` | `string` |
| `title` | `string` |

> 💡 You can use the **Example Database** on Xata Web UI.

---

Thanks to @Sam-Apostel for first finding this at [sam-apostel/blog](https://github.com/Sam-Apostel/blog)
