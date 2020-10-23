<!--  -->
<template>
  <div>vue</div>
</template>

<script>
import api from '@/api/api';
export default {
  name: 'Home',
  data() {
    return {};
  },

  mounted() {
    console.log(this.$store, api);
    api.getUserInfo().then(res => {
      console.log(`请求成功${JSON.stringify(res)}`, res);
    });
  },

  methods: {}
};
</script>
<style lang="scss" scoped></style>
