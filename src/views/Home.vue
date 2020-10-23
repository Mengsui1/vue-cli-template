<!--  -->
<template>
  <div>vue</div>
</template>

<script>
import api from '@/api/api';
import { handleApi } from '@/utils.js';
export default {
  name: 'Home',
  data() {
    return {};
  },

  mounted() {
    this.getUserInfo();
  },

  methods: {
    async getUserInfo() {
      const [err, res] = await handleApi(api.getUserInfo());
      if (!err) {
        console.log(res);
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
