<template>
  <div id="app">
    <img class="img-logo" alt="Vue logo" src="./assets/logo.png" />
    <Authorisation></Authorisation>
    <!-- <AuthorizationCheck></AuthorizationCheck> -->
  </div>
</template>

<script>
const Authorisation = () => import('@/components/Authorisation.vue');
// const AuthorizationCheck = () => import('@/components/AuthorizationCheck.vue');

export default {
  name: 'app',
  components: {
    Authorisation,
    // AuthorizationCheck,
  },
};
</script>

<style lang="scss">
/* Import Font Awesome Icons Set */
$fa-font-path: '~font-awesome/fonts/';
@import '~font-awesome/scss/font-awesome.scss';
#app {
  text-align: center;
  margin-top: 30px;
  .img-logo {
    max-width: 100px;
  }
}
</style>
