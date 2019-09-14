<template>
  <div id="app">
    <img class="img-logo" alt="Vue logo" src="./assets/logo.png" />
    <Login></Login>
    <AuthorizationCheck></AuthorizationCheck>
  </div>
</template>

<script>
const Login = () => import('@/components/Login.vue');
const AuthorizationCheck = () => import('@/components/AuthorizationCheck.vue');

export default {
  name: 'app',
  components: {
    Login,
    AuthorizationCheck,
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
  margin-top: 30px;
  .img-logo {
    max-width: 100px;
  }
}
</style>
