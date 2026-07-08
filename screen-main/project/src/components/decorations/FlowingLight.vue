<template>
  <div class="flowing-light-container">
    <div class="flowing-light-bar" />
    <div class="flowing-light-bar delay-1" />
    <div class="flowing-light-bar delay-2" />
  </div>
</template>

<style scoped lang="scss">
.flowing-light-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;
}

.flowing-light-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00f6ff, transparent);
  animation: flow 4s linear infinite;
}

.delay-1 {
  animation-delay: 1.3s;
  opacity: 0.6;
  height: 1px;
}

.delay-2 {
  animation-delay: 2.6s;
  opacity: 0.3;
  height: 1px;
}

@keyframes flow {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
