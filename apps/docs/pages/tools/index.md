---
layout: page
title: Tools – Utilities for working with DiceBear avatars
description: >
  Interactive utilities that help you understand how DiceBear handles colors,
  contrast, and avatar generation, built with the same algorithms used by the
  library itself.
aside: false
sidebar: false
---

<script setup lang="ts">
import ToolList from "@theme/components/tools/ToolList.vue";
import { UiContainer, UiHeadline, UiDescription } from "@theme/components/ui";
</script>

<UiContainer size="sm" class="tools-page">
  <div class="tools-hero">
    <UiHeadline tag="h1" class="tools-title">
      <strong>Tools</strong> Overview
    </UiHeadline>
    <UiDescription>
      Small, focused utilities for working with DiceBear avatars. Each tool uses the same algorithms as the <code>@dicebear/core</code> library, so what you see here matches what your generated avatars do.
    </UiDescription>
  </div>

  <ToolList />
</UiContainer>

<style>
.tools-page .tools-hero {
  text-align: center;
  padding: 80px 0 48px;
}
.tools-page code {
  background: var(--vp-c-bg-soft);
  padding: 2px 6px;
  border-radius: var(--vp-radius-xs);
  font-size: 0.9em;
}
</style>
