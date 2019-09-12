<template>
  <ValidationObserver v-slot="{ valid }" tag="form" @submit.prevent="onSubmit">
    <ValidationProvider
      tag="div"
      class="form-group"
      name="email"
      rules="required|email"
      v-slot="{ errors, valid, classes }"
    >
      <label class="email-group" :class="classes">
        <span class="form-group__title">Email</span>
        <input
          :class="classes"
          @input="
            {
              validEmail = valid;
            }
          "
          v-model="form.email"
          type="email"
        />
      </label>
      <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
      <span class="form-group__text-done" v-if="!registraton">
        Здравствуйте! Вы уже зарегистрированы.
      </span>
    </ValidationProvider>

    <ValidationProvider
      class="form-group"
      tag="div"
      name="ФИО"
      rules="telephone"
      v-slot="{ errors, classes }"
    >
      <label>
        <span class="form-group__title">ФИО</span>
        <input
          :class="classes"
          v-model="form.name"
          type="text"
          placeholder="Фамилия Имя Отчество"
        />
        <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
      </label>
    </ValidationProvider>

    <ValidationProvider
      class="form-group"
      tag="div"
      name="Телефон"
      rules="telephone"
      v-slot="{ errors, classes }"
    >
      <label>
        <span class="form-group__title">Телефон</span>
        <input :class="classes" type="tel" v-model="form.phone" />
        <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
      </label>
    </ValidationProvider>
    <button :disabled="!valid" type="submit">Регистрация</button>
  </ValidationObserver>
</template>

<script>
import axios from '@/axios.js';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, email, min } from 'vee-validate/dist/rules';

// Add a rule.
extend('email', {
  ...email,
  message: 'Не корректный E-mail',
});
// extend('email', email);
extend('required', {
  ...required,
  message: 'Обязательное поле',
});
extend('min', min);

extend('telephone', {
  params: ['min:10'],
  validate: (value, { min }) => Number(value) > min,
  message: 'введите больше 10 цифр',
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  name: 'login',
  data: () => ({
    value: null,
    validEmail: false,
    registraton: true,
    form: {
      email: null,
      lastName: null,
      name: null,
      secondName: null,
      phone: null,
      password: null,
    },
  }),
  mounted() {},
  computed: {
    checkValidEmail() {
      console.log('checkValidEmail');
      if (this.validEmail) {
        this.verifyingExistenceEmail();
        console.log('checkValidEmail-if');
      }
      return this.validEmail;
    },
  },
  methods: {
    verifyingExistenceEmail() {
      axios
        .post('/user/check-email-availability/', {
          EMAIL: this.form.email,
        })
        .then(response => {
          console.log(response.data);
          if (response.data.STATUS === 'ERROR') {
            console.log(response.data.STATUS);
            this.registraton = false;
          } else if (response.data.STATUS === 'OK') {
            console.log(response.data.STATUS);
            this.registraton = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onSubmit() {
      alert('форма отправлена');
    },
  },
};
</script>

<style lang="sass">
form
  display: block
  width: 100%
  max-width: 425px
  margin: auto
  padding:
    bottom: 25px
.form-group
  margin-bottom: 15px
  &__title
    font-weight: bold
    display: block
    text-align: left
  &__error
    color: $invalid
    display: inline-block
    margin-top: 5px
  &__text-done
    color: $valid
    margin-top: 5px
    display: inline-block
.email-group
  display: block
  position: relative
  input
    padding-right: 35px
  &.valid
    &::before
      content: '\f058'
      font-family: FontAwesome
      font-size: 22px
      display: block
      position: absolute
      border-radius: 50%
      color: $valid
      right: 10px
      bottom: 3.5px
input
  border: 1px solid #c8cbd6
  border-radius: 3px
  display: block
  padding: 10px
  width: 100%
  margin-top: 10px
  &.valid
    border: 1px solid $valid
  &.invalid
    border: 1px solid $invalid
button
  color: #ffffff
  background-color: $enabled
  border-radius: 3px
  text-transform: uppercase
  width: 100%
  border: none
  cursor: pointer
  padding: 10px 0
  transition: $tr
  margin-top: 20px
  &:hover
    background-color: darken($enabled, 10%)
  &[disabled]
    background-color: $disabled
    &:hover
      background-color: $disabled
      cursor: default
</style>
