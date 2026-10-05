<script setup lang="ts">
import { withBase } from 'vitepress';
</script>

<template>
  <div class="layout-footer-sponsor">
    <div class="layout-footer-container">
      <div class="layout-footer-sponsor-inner">
        <a
          href="https://bunny.net/"
          target="_blank"
          rel="noopener sponsored"
          class="layout-footer-sponsor-logo"
        >
          <img
            class="layout-footer-sponsor-logo-light"
            :src="withBase('/sponsors/bunny-light.svg')"
            alt="bunny.net"
            width="149"
            height="43"
          />
          <img
            class="layout-footer-sponsor-logo-dark"
            :src="withBase('/sponsors/bunny-dark.svg')"
            alt="bunny.net"
            width="149"
            height="43"
          />
        </a>
        <span class="layout-footer-sponsor-meta"
          >CDN sponsored by bunny.net · Advertisement</span
        >
      </div>
    </div>
  </div>
</template>
