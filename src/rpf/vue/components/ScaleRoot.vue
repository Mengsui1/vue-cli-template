<template>
  <div
    v-bind="$attrs"
    v-on="$listeners"
    class="rpf-scale-root"
    :style="{
      transform: `scale(${scale})`
    }"
  >
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'ScaleRoot',
  data() {
    return {
      scale: 1
    };
  },
  mounted() {
    this.onWinResize();
    window.addEventListener('resize', this.onWinResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWinResize);
  },
  methods: {
    onWinResize() {
      if (window.matchMedia('(min-aspect-ratio: 750 / 1000)').matches) {
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const rootH = winW * (1206 / 750);
        this.scale = winH / rootH;
      } else {
        this.scale = 1;
      }
    }
  }
};
</script>
<style scoped>
.rpf-scale-root {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

@media (min-aspect-ratio: 750 / 1000) {
  .rpf-scale-root {
    width: 100vw !important;
    height: 160.8vw !important;
    transform-origin: top center !important;
    margin: auto;
  }
}
</style>
