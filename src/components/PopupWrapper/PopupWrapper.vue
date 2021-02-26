<template>
  <section class="popup-wrapper">
    <!-- <transition name="fade-in-up"> -->
    <div :class="`popup-wrapper-container ${show ? 'show' : 'hide'}`">
      <slot></slot>
    </div>
    <!-- </transition> -->
  </section>
</template>

<script>
export default {
  name: 'PopupWrapper',
  data() {
    return {
      show: false
    };
  },
  methods: {},
  mounted() {
    const timer = setTimeout(() => {
      this.show = true;
      clearTimeout(timer);
    }, 20);
  }
};
</script>

<style lang="scss" scoped>
.popup-wrapper {
  @include bgcenter;
  overflow: hidden;
  &-container {
    @include center;
    transition: all 0.5s;
    &.show {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
    &.hide {
      opacity: 0;
      transform: translate3d(0, 500px, 0);
    }
  }
}
</style>
