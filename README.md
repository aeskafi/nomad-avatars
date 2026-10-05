<div align="center">

# 🎲 DiceBear

**Deterministic, modular SVG avatar generation for modern web applications and design systems.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Rollup](https://img.shields.io/badge/Rollup-EC4A3F?style=flat-square&logo=rollup.js&logoColor=white)](https://rollupjs.org/)
[![Jest](https://img.shields.io/badge/Jest-C21325?style=flat-square&logo=jest&logoColor=white)](https://jestjs.io/)
[![Lerna](https://img.shields.io/badge/Lerna-9333EA?style=flat-square&logo=lerna&logoColor=white)](https://lerna.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

</div>

---

## ⚡ Highlights

DiceBear is a versatile, high-performance avatar library that generates deterministic vector SVG avatars based on seed strings (usernames, emails, UUIDs, or random tokens). Whether you need placeholder avatars for onboarding, gaming personas, or profile pictures, DiceBear delivers lightweight, crisp graphics with zero client-side DOM dependencies.

- 🎯 **100% Deterministic Engine**: The same seed string and configuration will always generate the exact same avatar.
- 🎨 **20+ Distinct Sprite Collections**: Includes `bottts`, `avataaars`, `adventurer`, `open-peeps`, `micah`, `pixel-art`, `big-smile`, `croodles`, and more.
- 🚀 **High-Performance Vector Graphics**: Generates clean, lightweight SVG markup in microseconds without external network requests or canvas overhead.
- 📦 **Universal Module Bundles**: Distributed with CommonJS, ES Modules, and UMD builds complete with TypeScript declarations.
- 🛠️ **Modern Monorepo Architecture**: Managed via Lerna and Yarn workspaces with automated schema validation and Rollup pipelines.

---

## 🚀 Quickstart

### 1. Clone the Repository

```bash
git clone https://github.com/aeskafi/dicebear.git
cd dicebear
```

### 2. Install Dependencies & Build Core Packages

```bash
yarn install --ignore-scripts
yarn --cwd packages/dicebear-project build
yarn --cwd packages/@dicebear/avatars build
```

### 3. Run Test Suites & Generate Avatar Demo

```bash
yarn --cwd packages/@dicebear/avatars test
yarn demo  # Generates test-avatar.svg
```

### 4. Run Documentation Website Locally

```bash
yarn website:build
yarn website:serve  # Live at http://localhost:3000
# Or for live hot-reload development:
yarn website:start
```

---

## 💻 Usage Example

Using the core avatar engine in JavaScript or TypeScript:

```typescript
import { createAvatar } from '@dicebear/avatars';
import * as botttsStyle from '@dicebear/avatars-bottts-sprites';

// Generate a deterministic SVG avatar string
const svg = createAvatar(botttsStyle, {
  seed: 'tech-nomad-2026',
  dataUri: false,
});

console.log(svg);
// Output: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ...">...</svg>
```

---

## 📁 Repository Structure

```text
dicebear/
├── packages/
│   ├── @dicebear/
│   │   ├── avatars/                   # Core deterministic avatar generator engine
│   │   ├── avatars-bottts-sprites/    # Robot/Bottts avatar sprite collection
│   │   ├── adventurer/                # Fantasy adventurer sprite pack
│   │   ├── open-peeps/                # Hand-drawn illustration library
│   │   └── ...                        # 20+ additional specialized sprite collections
│   ├── dicebear/                      # CLI wrapper for local asset generation
│   └── dicebear-project/              # Build tooling, schema compilers & Rollup pipelines
├── plugins/
│   └── figma/                         # Figma export integration plugin
├── website/                           # Docusaurus-powered documentation portal
└── scripts/                           # CDN deployment and maintenance utilities
```

---

## 🤝 Credits & Upstream

- **Upstream Project**: Created and maintained by [Florian Körner](https://github.com/floriankoerner) and the [DiceBear Community](https://dicebear.com).
- **Modernized & Curated by**: [Arham Eskafi](https://arham.dev) — Rapid MVP Specialist and creator documenting life on the road as an overland tech nomad on [Walk Cook Live](https://youtube.com/@walkcooklive).

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE). Third-party sprite designs retain their respective design licenses (see individual package LICENSE and `SOURCES.md` files).
