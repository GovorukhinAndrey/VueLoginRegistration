<template>
  <button class="fixed-btn btn" @click="authorizationCheck()" type="button">
    Перейти в личный кабинет
  </button>
</template>

<script>
import axios from '@/axios.js';

export default {
  name: 'AuthorizationCheck',
  data: () => ({
    authToken: '',
    authenticationTicket: '',
  }),
  mounted() {},

  computed: {},
  methods: {
    getLocalStorage() {
      if (localStorage.getItem('authToken')) {
        this.authToken = localStorage.getItem('authToken');
      } else {
        this.authToken = '330d207892855dbd5abd5147ea562094';
      }
      if (localStorage.getItem('authenticationTicket')) {
        this.authenticationTicket = localStorage.getItem('authenticationTicket');
      } else {
        this.authenticationTicket = '330d207892855dbd5abd5147ea562094';
      }
    },
    authorizationCheck() {
      this.getLocalStorage();
      axios
        .get('/user-session/', {
          params: {
            SESSID: this.authToken,
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
