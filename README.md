# Journal of Digital History

**TL; DR**

To start use: `yarn install`
This monorepo uses Yarn v4 PnP for efficient dependency management and Vite for fast development. Each app is isolated but shares dependencies via the PnP system. No traditional `node_modules` directories are used.

---

This is a monorepo managed with **Yarn v4** using the Plug'n'Play (PnP) feature and **Vite**.

## Architecture

- **Monorepo:** Managed with Yarn Workspaces and PnP.  
- **Apps:** Each application (e.g., `dashboard`, `website`) has its own `package.json`, `public`, and `src` directories, as well as its own `vite.config.js` and `tsconfig.json`.
- **Dependencies:** Dependencies are declared per app, but are installed and resolved centrally by Yarn PnP—**no `node_modules` directories are created by default**. (If you see `.yarn/unplugged` or `.yarn/cache`, these are managed by Yarn and not traditional `node_modules`.)

## Development Setup

1. **Install dependencies (from the root):**
    ```bash
    yarn install
    ```
    This will:
    - Set up the Yarn PnP environment.
    - Create `.pnp.cjs` (for CommonJS) and `.pnp.loader.mjs` (for ESM) at the root.  

2. **Start an app in development mode from workspace:**
    ```bash
    yarn workspace website dev
    # or
    yarn workspace dashboard dev
    ```
    Each app runs its own Vite dev server.

## Setup VsCode editor for typescript files

To remove the red underlining in all `.tsx` files in VsCode editor : 

1. Install the ZipFS extension, which is maintained by the Yarn team.
2. Run the following command, which will generate a .vscode/settings.json file:
    ```bash
    yarn dlx @yarnpkg/sdks vscode
    ```

3. For safety reason VSCode requires you to explicitly activate the custom TS settings:
    - Press ctrl+shift+p in a TypeScript file
    - Choose "Select TypeScript Version"
    - Pick "Use Workspace Version"

Do not hesitate to restart Vscode to apply the changes, and to restart from `New window` > `Open` > Open the `journal-of-digital-history` project.

Please find Yarn documentation here : https://yarnpkg.com/getting-started/editor-sdks