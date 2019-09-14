<template>
  <button class="fixed-btn btn" @click="authorizationCheck()" type="button">
    Перейти в личный кабинет
  </button>
</template>

<script>
import axios from '@/axios.js';

export default {
  name: 'AuthorizationCheck',
  data: () => ({}),
  mounted() {},
  computed: {},
  methods: {
    authorizationCheck() {
      axios
        .get('/user-session/', {
          params: {
            SESSID: '330d207892855dbd5abd5147ea562094',
            // SESSID: '44673cb5c786ee709b9f3e76923bc6e9',
            TYPE_PLATFORM: 'desktop',
          },
        })
        .then(response => {
          console.log(response.data);
          this.$swal('Проверка авторизации пользователя', {
            text: `Проверка авторизации пользователя`,
            icon: 'success',
          });
          this.formReset();
        })
        .catch(error => {
          console.log(error);
          this.$swal('Error', {
            text: 'Что то пошло не так :(',
            icon: 'error',
          });
        });
    },
  },
};
</script>

<style lang="sass">
.fixed-btn
  position: fixed
  top: 10px
  right: 10px
  font-size: 14px
</style>
