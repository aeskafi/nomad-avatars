<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowRight, ChartNoAxesCombined } from '@lucide/vue';
import Button from 'primevue/button';
import { UiContainer, UiSection, UiSectionHeader } from '../ui';
import AppStatsBannerCard from './AppStatsBannerCard.vue';
import { useVisibility } from '../../composables/useVisibility';
import { useApiStats, useApiStatsRaw } from '../../composables/useApiStats';
import { formatNumberParts, formatBytesParts } from '../../utils/format';

const sectionRef = ref();
const isVisible = useVisibility(sectionRef, { threshold: 0.15 });

const apiStats = useApiStats();
const apiStatsRaw = useApiStatsRaw();

const monthLabel = computed(
  () => apiStats.value?.monthLabel ?? 'the past month',
);

const requests = computed(() =>
  apiStats.value
    ? formatNumberParts(apiStats.value.monthlyRequests)
    : { value: '1', unit: 'B' },
);

const traffic = computed(() =>
  apiStats.value
    ? formatBytesParts(apiStats.value.monthlyTraffic)
    : { value: '3', unit: 'TB' },
);

const downloads = computed(() =>
  apiStats.value
    ? formatNumberParts(apiStats.value.monthlyNpmDownloads)
    : { value: '500', unit: 'K' },
);
</script>

<template>
  <UiSection ref="sectionRef" :class="{ visible: isVisible }" divider>
    <template #background>
      <div class="app-stats-banner-gradient"></div>
    </template>
    <UiContainer>
      <UiSectionHeader
        class="app-stats-banner-header"
        description="Usage data from our HTTP-API and npm packages, updated weekly."
      >
        <template #headline
          >Billions of avatars. <strong>One API.</strong></template
        >
      </UiSectionHeader>

      <div class="app-stats-banner-grid">
        <AppStatsBannerCard
          href="/stats/"
          title="API Requests"
          :description="`Avatars generated via the HTTP-API in ${monthLabel}.`"
          :value="requests.value"
          :unit="requests.unit"
          :daily="apiStatsRaw?.requests"
        />
        <AppStatsBannerCard
          href="/stats/"
          feature
          title="Data Served"
          :description="`Total traffic delivered through our global CDN in ${monthLabel}.`"
          :value="traffic.value"
          :unit="traffic.unit"
          :daily="apiStatsRaw?.traffic"
        />
        <AppStatsBannerCard
          href="/stats/"
          title="npm Downloads"
          :description="`Total downloads from the npm registry in ${monthLabel}.`"
          :value="downloads.value"
          :unit="downloads.unit"
          :daily="apiStatsRaw?.downloads.npm"
        />
      </div>

      <div class="app-stats-banner-action">
        <Button
          as="a"
          href="/stats/"
          size="large"
          severity="secondary"
          variant="outlined"
        >
          <ChartNoAxesCombined :size="20" />
          View Full Statistics
          <ArrowRight :size="18" />
        </Button>
      </div>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.app-stats-banner {
  &-gradient {
    background:
      radial-gradient(
        ellipse 50% 50% at 50% 0%,
        color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent),
        transparent
      ),
      radial-gradient(
        ellipse 50% 50% at 50% 100%,
        color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent),
        transparent
      );
  }

  &-header {
    opacity: 0;
    transform: translateY(30px);
    transition: all var(--duration-reveal) var(--ease-smooth);

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  &-action {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    opacity: 0;
    transform: translateY(20px);
    transition: all var(--duration-reveal) var(--ease-smooth) 0.3s;

    .visible & {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

@media (max-width: 1000px) {
  .app-stats-banner-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .app-stats-banner-grid {
    grid-template-columns: 1fr;
  }
}
</style>
