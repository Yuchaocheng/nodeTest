<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      foo: 1
    }
  },
}
</script>

<style>
@import url("./assets/scss/index.scss");
</style>
