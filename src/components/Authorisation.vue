<template>
  <ValidationObserver
    ref="observer"
    v-slot="{ valid }"
    tag="form"
    class="authorisation"
    @submit.prevent="onSubmit"
  >
    <h2 class="title">{{ title }}</h2>
    <!-- email -->
    <ValidationProvider
      tag="div"
      class="form-group"
      name="email"
      rules="required|email"
      v-slot="{ errors, valid, classes, invalid }"
    >
      <label class="email-group" :class="classes">
        <span class="form-group__title">Email</span>
        <input
          placeholder="email@mail.com"
          class="form-group__input"
          :class="classes"
          v-model="form.email"
          type="email"
        />
      </label>
      <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
      <span class="form-group__text-done" v-if="!registraton && !invalid && recovery === false">
        Здравствуйте! Вы уже зарегистрированы.
      </span>
    </ValidationProvider>
    <!-- Поля для входа -->
    <template v-if="conditionLogin">
      <ValidationProvider
        class="form-group"
        tag="div"
        rules="required"
        v-slot="{ errors, classes }"
        key="loginPass"
      >
        <span class="form-group__show-pass-wrapper">
          <label for="password" class="form-group__title">
            Введите пароль
          </label>
          <span
            @click="switchVisibility"
            v-if="passwordFieldType === 'password'"
            class="form-group__show-pass-btn"
          >
            <i class="fa fa-eye" aria-hidden="true"></i> Показать пароль
          </span>
          <span
            @click="switchVisibility"
            v-else-if="passwordFieldType === 'text'"
            class="form-group__show-pass-btn"
          >
            <i class="fa fa-eye-slash" aria-hidden="true"></i> Скрыть пароль
          </span>
        </span>
        <input
          id="password"
          :class="classes"
          class="form-group__input"
          placeholder="Введите пароль"
          v-model="form.password"
          :type="passwordFieldType"
        />
        <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
      </ValidationProvider>

      <div class="form-group">
        <label class="checkbox">
          <input v-model="checkbox" type="checkbox" />
          <div class="checkbox__text">Запоминать авторизацию?</div>
        </label>
      </div>

      <a href="#" @click.prevent="recovery = true" class="link">Забыли пароль?</a>
    </template>
    <!-- восстановление пароля -->
    <Recovery v-else-if="conditionRecovery" @move-on-login="recovery = false"></Recovery>
    <!-- Поля для регистрации -->
    <template v-else>
      <ValidationProvider
        class="form-group"
        tag="div"
        name="ФИО"
        :rules="{
          fullName: /^[a-zA-Zа-яА-ЯёЁ]+ [a-zA-Zа-яА-ЯёЁ]+ [a-zA-Zа-яА-ЯёЁ]+$/,
        }"
        v-slot="{ errors, classes }"
      >
        <label for="fullName" class="form-group__title">
          ФИО
        </label>
        <span
          class="question"
          content="Служба доставки выдаст заказ по паспорту"
          v-tippy="{ trigger: 'click' }"
        ></span>
        <span class="form-group__placeholder">
          <span class="form-group__placeholder-input" v-html="placholderFullName"></span>
          <input
            id="fullName"
            :class="classes"
            class="form-group__input"
            v-model="fullName"
            type="text"
          />
        </span>
        <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider
        class="form-group"
        tag="div"
        name="Телефон"
        :rules="{ telephone: 10 }"
        v-slot="{ errors, classes }"
      >
        <label for="phone" class="form-group__title">
          Телефон
        </label>
        <input
          id="phone"
          placeholder="Введите номер телефона"
          :class="classes"
          class="form-group__input"
          type="tel"
          v-model="form.phone"
        />
        <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
      </ValidationProvider>
    </template>
    <button :disabled="!valid" class="button" type="submit">
      {{ buttonText }}
    </button>
  </ValidationObserver>
</template>

<script>
import axios from '@/axios.js';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { validate } from 'vee-validate';
import '@/vue-validate.js';
const Recovery = () => import('@/components/authorisation/Recovery.vue');

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    Recovery,
  },
  name: 'Authorisation',
  data: () => ({
    checkbox: true,
    registraton: true,
    recovery: false,
    passwordFieldType: 'password',
    fullName: null,
    placeholder: {
      name: 'Имя',
      lastName: 'Фамилия',
      secondName: 'Отчество',
    },
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
  watch: {
    'form.email'() {
      this.validateEmail(this.form.email, 'required|email');
    },
    fullName: 'watchingFullName',
  },
  computed: {
    remember() {
      return this.checkbox ? 'Y' : 'N';
    },
    conditionLogin() {
      return !this.registraton && this.recovery === false;
    },
    conditionRecovery() {
      return !this.registraton && this.recovery === true;
    },
    title() {
      return this.conditionLogin
        ? 'Вход'
        : this.conditionRecovery
        ? 'Восстановление пароля'
        : 'Регистрация';
    },
    buttonText() {
      return this.conditionLogin
        ? 'Вход'
        : this.conditionRecovery
        ? 'Отправить пароль на Email'
        : 'Регистрация';
    },
    placholderFullName() {
      return `${this.placeholder.lastName} ${this.placeholder.name} ${this.placeholder.secondName}`;
    },
  },
  methods: {
    watchingFullName() {
      let fullName = this.fullName;
      let arrFullName = this.fullName ? fullName.split(' ') : [];

      this.setFieldsName(arrFullName);
      this.checkPlaceholder(arrFullName);
    },
    checkPlaceholder(arrFullName) {
      let checkUp = arrFullName.filter((el, index) => {
        return el === '' && !(index === arrFullName.length - 1);
      });

      if (checkUp.length >= 1) {
        this.placeholder.lastName = `<span class="transparent">Фамилия</span>`;
        this.placeholder.name = `<span class="transparent">Имя</span>`;
        this.placeholder.secondName = `<span class="transparent">Отчество</span>`;
      } else {
        this.setPlacholderFullName(arrFullName);
      }
    },
    setPlacholderFullName([lastName, name, secondName]) {
      this.placeholder.lastName = lastName
        ? `<span class="transparent">${lastName}</span>`
        : 'Фамилия';
      this.placeholder.name = name ? `<span class="transparent">${name}</span>` : 'Имя';
      this.placeholder.secondName = secondName
        ? `<span class="transparent">${secondName}</span>`
        : 'Отчество';
    },
    setFieldsName([lastName = null, name = null, secondName = null]) {
      this.form.lastName = lastName;
      this.form.name = name;
      this.form.secondName = secondName;
    },
    validateEmail(value, rules) {
      validate(value, rules).then(result => {
        if (result.valid) {
          this.verifyingExistenceEmail();
        } else {
          this.registraton = true;
          this.recovery = false;
        }
      });
    },
    verifyingExistenceEmail() {
      console.log('Проверка Email');
      axios
        .post('/user/check-email-availability/', {
          EMAIL: this.form.email,
        })
        .then(response => {
          if (response.data.STATUS === 'ERROR') {
            console.log('Email - зарегистрирован');
            this.registraton = false;
          } else if (response.data.STATUS === 'OK') {
            console.log('Email - свободен');
            this.registraton = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    onSubmit() {
      return this.conditionLogin
        ? this.userLogin()
        : this.conditionRecovery
        ? this.passwordRecovery()
        : this.userRegistration();
    },
    passwordRecovery() {
      axios
        .post('/user/password-recovery/', {
          SESSID: '44673cb5c786ee709b9f3e76923bc6e9',
          TYPE_PLATFORM: 'desktop',
          LOGIN: this.form.email,
        })
        .then(response => {
          console.log(response.data);
          this.$swal('Восстановление пароля', {
            text: `Пароль отправлен на почту ${response.data.DATA.LOGIN}`,
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
    userLogin() {
      axios
        .post('/user-session/', {
          LOGIN: this.form.email,
          PASSWORD: this.form.password,
          REMEMBER: this.remember,
        })
        .then(response => {
          console.log(response.data);
          this.$swal('Пользователь авторизован', {
            text: `Пользователь с ID = "${response.data.DATA.USER.ID}" авторизован`,
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
    userRegistration() {
      axios
        .post('/user/', {
          EMAIL: this.form.email,
          LAST_NAME: this.form.lastName,
          NAME: this.form.name,
          SECOND_NAME: this.form.secondName,
          PERSONAL_PHONE: this.form.phone,
          AUTHORIZE: 'Y',
        })
        .then(response => {
          console.log(response.data);
          this.$swal('Регистрация прошла успешно', {
            text: `Пользователь с ID = "${response.data.DATA.USER_ID}" успешно зарегистрирован`,
            icon: 'success',
          });
          this.formReset();
          localStorage.setItem('authToken', response.data.DATA.USER.authToken);
          localStorage.setItem(
            'authenticationTicket',
            response.data.DATA.USER.authenticationTicket
          );
        })
        .catch(error => {
          console.log(error);
          this.$swal('Error', {
            text: 'Что то пошло не так :(',
            icon: 'error',
          });
        });
    },
    formReset() {
      this.form.email = null;
      this.form.phone = null;
      this.form.password = null;
      this.fullName = null;
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    },
    switchVisibility() {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    },
  },
};
</script>

<style lang="sass" scoped>
.checkbox
  position: relative
  display: block
  input
    position: absolute
    z-index: -1
    opacity: 0
    transition: $tr
    &:checked + .checkbox__text::after
      opacity: 1
  &__text
    position: relative
    transition: $tr
    padding:
      left: 25px
    &::before
      content: ''
      position: absolute
      left: 0
      top: 3px
      width: 16px
      height: 16px
      cursor: pointer
      background-color: #e1e1e1
    &::after
      content: "\f00c"
      font-family: FontAwesome
      position: absolute
      left: 1px
      top: 3px
      font-size: 13px
      line-height: 16px
      transition: $tr
      opacity: 0
      cursor: pointer
.question
  cursor: pointer
  &::after
    content: "\F29C"
    font-family: FontAwesome
    font-weight: normal
    color: #b9b9b9
.authorisation
  display: block
  width: 100%
  max-width: 425px
  margin: auto
  padding:
    bottom: 25px
    right: 15px
    left: 15px
.form-group
  margin-bottom: 15px
  text-align: left
  position: relative
  &__placeholder
    position: relative
    display: block
    input
      background-color: transparent
      position: absolute
      bottom: 0
    &-input
      line-height: 1.15
      border: 1px solid transparent
      color: #a6a6a6
      cursor: text
      border-radius: 3px
      display: block
      padding: 10px
      width: 100%
      margin-top: 10px
      &::selection
        background-color: transparent
        color: #a6a6a6
  &__title
    font-weight: bold
    display: inline
  &__error
    color: $invalid
    display: block
    margin-top: 5px
    text-align: center
  &__text-done
    color: $valid
    margin-top: 5px
    display: block
    text-align: center
  &__show-pass-wrapper
    display: flex
    justify-content: space-between
  &__show-pass-btn
    cursor: pointer
  &__input
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
.button
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
</style>
