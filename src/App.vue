<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <Login></Login>
  </div>
</template>

<script>
const Login = () => import('@/components/Login.vue');

export default {
  name: 'app',
  components: {
    Login,
  },
};
</script>

<style lang="scss">
/* Import Font Awesome Icons Set */
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome.scss';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
