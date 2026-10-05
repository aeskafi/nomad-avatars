<div align="center">

# 🌍 NomadAvatars

**The Ultimate Deterministic Avatar Generator Studio & Multi-Language Engine for Tech Nomads, Creators & Developers.**

[![DiceBear Core](https://img.shields.io/badge/DiceBear_Core-v10.7.0-3b82f6.svg?style=flat-square)](https://www.dicebear.com)
[![Node.js](https://img.shields.io/badge/Node.js-%3E=20.19.0-339933.svg?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-007ACC.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue 3](https://img.shields.io/badge/Vue.js-3.5-4FC08D.svg?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646CFF.svg?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)

<br/>

<p align="center">
  <img src="https://www.dicebear.com/readme-hero.svg" alt="NomadAvatars collection preview" width="100%" />
</p>

</div>

---

## ⚡ Highlights

**NomadAvatars** transforms any seed string (username, email, nomad handle, or travel coordinate) into a crisp, customizable vector SVG avatar across **61+ distinct styles** — from hand-drawn characters and pixel art to modern isometric and geometric personas.

- 🎯 **100% Deterministic Output**: The same seed string and configuration guaranteed to produce the exact same avatar every time.
- 🎨 **Interactive Nomad Avatar Studio (`apps/editor`)**: Built with Vue 3, Vite, PrimeVue, and Pinia. Includes:
  - Real-time SVG vector rendering
  - One-click **Copy SVG** to clipboard for seamless pasting into Figma, React, or HTML
  - High-res PNG & SVG downloads
  - **🎲 Nomad Shuffle**: Instantly explores randomized styles and nomadic persona seeds
- 🚀 **Sub-Millisecond Engine (`@dicebear/core`)**: Zero client DOM overhead, lightweight bundle footprint, and 755/755 unit tests passing.
- 🌐 **7-Language Byte-Identical Parity**: Native implementations for JavaScript/TypeScript, Python, Rust, Go, PHP, Dart, and C#.

---

## 🚀 Quickstart

### 1. Clone & Install

```bash
git clone https://github.com/aeskafi/dicebear.git nomad-avatars
cd nomad-avatars
npm install --ignore-scripts
```

### 2. Launch the Nomad Avatar Studio

```bash
npm run editor:build
npm run editor:preview  # Live at http://localhost:3000
```

For hot-reload local development:

```bash
npm run editor:dev
```

### 3. Run Tests & Demo Script

```bash
# Run the 755-test core test suite:
npm run core:test

# Generate a quick demo avatar in <50ms:
npm run demo
```

---

## 💻 Programmatic Usage

Generate deterministic avatars directly in Node.js or modern browsers:

```typescript
import { Style, Avatar } from '@dicebear/core';
import loreleiDef from '@dicebear/styles/lorelei.json' with { type: 'json' };

// Initialize style definition
const style = new Style(loreleiDef);

// Create avatar instance
const avatar = new Avatar(style, {
  seed: 'walk-cook-live',
  flip: false,
  rotate: 0,
});

// Export as SVG string
const svg = avatar.toString();
console.log(svg);
// Output: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ...">...</svg>
```

---

## 🌐 Multi-Language Support

NomadAvatars is powered by the DiceBear 10 specification, ensuring identical avatar generation across all major backend and mobile platforms:

| Language | Package | Command |
|---|---|---|
| **JavaScript / TypeScript** | `@dicebear/core` | `npm install @dicebear/core` |
| **Python** | `dicebear-core` | `pip install dicebear-core` |
| **Rust** | `dicebear-core` | `cargo add dicebear-core` |
| **Go** | `dicebear-go` | `go get github.com/dicebear/dicebear-go/v10` |
| **PHP** | `dicebear/core` | `composer require dicebear/core` |
| **Dart / Flutter** | `dicebear_core` | `dart pub add dicebear_core` |
| **C# / .NET** | `DiceBear.Core` | `dotnet add package DiceBear.Core` |

---

## 📁 Repository Structure

```text
nomad-avatars/
├── apps/
│   ├── editor/          # Nomad Avatar Studio web app (Vue 3, Vite, PrimeVue)
│   └── docs/            # VitePress documentation portal
├── src/
│   ├── js/
│   │   ├── core/        # Core avatar engine (@dicebear/core)
│   │   ├── cli/         # Command-line avatar generation tool
│   │   └── converter/   # SVG to PNG/JPEG raster converters
│   ├── python/          # Native Python implementation
│   ├── rust/            # Native Rust implementation
│   ├── go/              # Native Go implementation
│   ├── php/             # Native PHP implementation
│   ├── dart/            # Native Dart implementation
│   └── csharp/          # Native C# implementation
└── tests/               # Parity test suites across all 7 languages
```

---

## 🤝 Credits & Upstream

- **Upstream Engine**: Created by [Florian Körner](https://github.com/floriankoerner) and the [DiceBear Community](https://www.dicebear.com).
- **Customized & Curated by**: [Arham Eskafi](https://arham.dev) — Rapid MVP Specialist and creator documenting life on the road as an overland tech nomad on [Walk Cook Live](https://youtube.com/@walkcooklive).

---

## 📄 License

This repository is licensed under the [MIT License](LICENSE). Third-party avatar styles retain their respective artwork licenses (see individual style definitions in `@dicebear/styles`).
