<template>
  <div class="playground-loader">
    <div class="playground-loader-body">
      <div class="playground-loader-spinner" />
      <div class="playground-loader-text">Please wait...</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playground-loader {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 180px);
  padding: 120px;

  &-body {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &-spinner {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: var(--vp-c-brand-1);
    animation: playground-loader 1.1s infinite linear;
  }

  &-text {
    text-align: center;
    margin-top: 12px;
  }
}

@keyframes playground-loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
