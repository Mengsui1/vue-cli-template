<template>
  <div class="cp-wrap">
    <svg
      class="svg"
      width="100%"
      height="100%"
      :viewBox="`0 0 ${size} ${size}`"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="circle"
        :r="circleR"
        :cx="circleRDot"
        :cy="circleRDot"
        fill="transparent"
        :stroke="stroke"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circleLength"
        stroke-dashoffset="0"
      ></circle>
      <circle
        class="circle circle-active"
        :r="circleR"
        :cx="circleRDot"
        :cy="circleRDot"
        fill="transparent"
        :stroke="activeStroke"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circleLength"
        :stroke-dashoffset="circleLength"
        :style="{
          strokeDashoffset: offset
        }"
      ></circle>
    </svg>
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 50
    },
    strokeWidth: {
      type: Number,
      default: 10
    },
    activeStroke: {
      type: String,
      default: '#ffbb00'
    },
    stroke: {
      type: String,
      default: '#aaa'
    }
  },
  computed: {
    circleR() {
      return (this.size - this.strokeWidth) / 2;
    },
    circleRDot() {
      return this.size / 2;
    },
    circleLength() {
      return this.circleR * Math.PI * 2;
    },
    offset() {
      return this.circleLength * (1 - this.percent / 100);
    }
  }
};
</script>
<style scoped>
.cp-wrap {
  position: relative;
  width: 100px;
  height: 100px;
}
.cp-wrap > .svg {
  transform: rotate(-90deg);
}
</style>
