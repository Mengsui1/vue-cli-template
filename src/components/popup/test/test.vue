<!-- 测试弹窗 -->
<template>
  <popup-wrapper>
    <div @click="testClick">1111111111</div>
  </popup-wrapper>
</template>

<script>
import PopupWrapper from '@/components/PopupWrapper/PopupWrapper.vue';
export default {
  name: 'test',
  props: {
    a: {
      type: String
    },
    test: {
      type: String,
      default: '1234'
    }
  },

  data() {
    return {};
  },

  mounted() {},

  methods: {
    testClick() {
      this.$emit('close');
      // this.close();
    }
  }
};
</script>
<style lang="scss" scoped></style>
