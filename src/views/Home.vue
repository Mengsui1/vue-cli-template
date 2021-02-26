<!--  -->
<template>
  <div>vue</div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {};
  },

  async mounted() {
    this.getUserInfo();
    await this.$modal({
      type: 'test'
    });
  },

  methods: {
    async getUserInfo() {}
  }
};
</script>
<style lang="scss" scoped></style>
