<template>
  <ValidationObserver ref="observer" v-slot="{ valid }" tag="form" @submit.prevent="onSubmit">
    <h2 class="title">{{ getTitle }}</h2>
    <ValidationProvider
      tag="div"
      class="form-group"
      name="email"
      rules="required|email"
      v-slot="{ errors, valid, classes, invalid }"
    >
      <label class="email-group" :class="classes">
        <span class="form-group__title">Email</span>
        <input placeholder="email@mail.com" :class="classes" v-model="form.email" type="email" />
      </label>
      <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
      <span class="form-group__text-done" v-if="!registraton && !invalid && recovery === false">
        Здравствуйте! Вы уже зарегистрированы.
      </span>
    </ValidationProvider>
    <!-- Поля для регистрации -->
    <template v-if="registraton">
      <ValidationProvider
        class="form-group"
        tag="div"
        name="ФИО"
        :rules="{ fullName: /^[aA-zZа-яА-ЯёЁ]+[\s]+[aA-zZа-яА-ЯёЁ]+[\s]+[aA-zZа-яА-ЯёЁ]+$/ }"
        v-slot="{ errors, classes }"
      >
        <label>
          <span
            class="form-group__title question"
            content="Служба доставки выдаст заказ по паспорту"
            v-tippy
          >
            ФИО
          </span>
          <input
            :class="classes"
            v-model="fullName"
            type="text"
            :placeholder="placeholderFullName"
          />
          <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
        </label>
      </ValidationProvider>

      <ValidationProvider
        class="form-group"
        tag="div"
        name="Телефон"
        :rules="{ telephone: 10 }"
        v-slot="{ errors, classes }"
      >
        <label>
          <span class="form-group__title">Телефон</span>
          <input
            placeholder="Введите номер телефона"
            :class="classes"
            type="tel"
            v-model="form.phone"
          />
          <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
        </label>
      </ValidationProvider>
      <!-- пароль для регистрации-->
      <!-- <ValidationObserver> -->
      <ValidationProvider
        class="form-group"
        name="password"
        tag="div"
        rules="required|password:confirmation"
        v-slot="{ errors, classes }"
      >
        <label>
          <span class="form-group__title">Введите пароль</span>
          <input
            placeholder="Пароль регистрации"
            :class="classes"
            v-model="form.password"
            type="password"
          />
          <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
        </label>
      </ValidationProvider>

      <ValidationProvider
        class="form-group"
        tag="div"
        name="confirmation"
        rules="required"
        v-slot="{ errors, classes }"
      >
        <label>
          <span class="form-group__title">Подтверждение пароля</span>
          <input
            placeholder="Повторите пароль"
            :class="classes"
            v-model="confirm"
            type="password"
          />
          <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
        </label>
      </ValidationProvider>
      <!-- </ValidationObserver> -->
      <button :disabled="!valid" @click.prevent="onSubmit" type="submit">Регистрация</button>
    </template>
    <!-- Поля для входа -->
    <template v-else-if="!registraton && recovery === false">
      <ValidationProvider
        class="form-group"
        tag="div"
        rules="required"
        v-slot="{ errors, classes }"
        key="loginPass"
      >
        <label>
          <span class="form-group__show-pass-wrapper">
            <span class="form-group__title">Введите пароль</span>
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
            :class="classes"
            placeholder="Введите пароль"
            v-model="login.password"
            :type="passwordFieldType"
          />
          <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
        </label>
      </ValidationProvider>
      <a href="#" @click.prevent="recovery = true" class="link">Забыли пароль?</a>

      <button :disabled="!valid" @click.prevent="onSubmit" type="submit">Вход</button>
    </template>
    <!-- восстановление пароля -->
    <template v-else-if="!registraton && recovery === true">
      <a href="#" @click.prevent="recovery = false" class="link">Вернуться к автризации</a>

      <button :disabled="!valid" @click.prevent="onSubmit" type="submit">
        Отправить пароль на email
      </button>
    </template>
  </ValidationObserver>
</template>

<script>
import axios from '@/axios.js';
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { extend } from 'vee-validate';
import { validate } from 'vee-validate';
import { required, email, min, regex } from 'vee-validate/dist/rules';

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

extend('fullName', {
  ...regex,
  message: 'Введите Правильное ФИО', // the error message
});

extend('telephone', {
  ...min,
  message: 'введите больше 10 цифр',
});

extend('password', {
  validate: (value, { other }) => value === other,
  message: 'Подтверждение пароля не совпадает',
  params: [{ name: 'other', isTarget: true }],
});

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  name: 'login',
  data: () => ({
    value: null,
    registraton: true,
    recovery: false,
    confirm: null,
    passwordFieldType: 'password',
    fullName: null,
    placeholderFullName: 'Фамилия Имя Отчество',
    form: {
      email: null,
      lastName: null,
      name: null,
      secondName: null,
      phone: null,
      password: null,
    },
    login: {
      password: null,
      remeber: 'Y',
    },
  }),
  mounted() {},
  watch: {
    'form.email': function() {
      this.validateEmail(this.form.email, 'required|email');
    },
  },
  computed: {
    getTitle: function() {
      let title = 'Регистрация';
      if (this.registraton) {
        title = 'Регистрация';
      } else if (!this.registraton && this.recovery === false) {
        title = 'Вход';
      } else if (!this.registraton && this.recovery === true) {
        title = 'Восстановление пароля';
      }
      return title;
    },
    fieldsName: function() {
      let arrFullName = this.fullName.split(' ');
      this.getFieldsName(arrFullName);
      let result = this.fullName ? arrFullName : [];
      this.setPlacholderFullName(result);
      return result;
    },
  },
  methods: {
    setPlacholderFullName(arrFullName) {
      if (arrFullName.length === 0) {
        this.placeholderFullName = 'Фамилия Имя Отчество';
      } else if (arrFullName.length === 1) {
        this.placeholderFullName = ' Имя Отчество';
      } else if (arrFullName.length === 2) {
        this.placeholderFullName = ' Отчество';
      } else {
        this.placeholderFullName = 'Фамилия Имя Отчество';
      }
    },
    getFieldsName(fullName) {
      this.form.lastName = fullName[0];
      this.form.name = fullName[1];
      this.form.secondName = fullName[2];
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
      if (this.registraton) {
        this.userRegistration();
      } else if (!this.registraton && this.recovery === false) {
        this.userLogin();
      } else if (!this.registraton && this.recovery === true) {
        this.passwordRecovery();
      }
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
    authorizationCheck() {
      axios
        .get('/user-session/', {
          SESSID: '330d207892855dbd5abd5147ea562094',
          TYPE_PLATFORM: 'desktop',
        })
        .then(response => {
          console.log(response.data);
          this.$swal('проверка авторизации пользователя', {
            text: `проверка авторизации пользователя`,
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
    userLogin() {
      axios
        .get('/user/', {
          LOGIN: this.form.email,
          PASSWORD: this.login.password,
          REMEMBER: this.login.remeber,
        })
        .then(response => {
          console.log(response.data);
          this.$swal('Пользователь авторизован', {
            text: `Пользователь с ID = "${response.data.DATA.USER_ID}" авторизован`,
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
      this.form.lastName = null;
      this.form.name = null;
      this.form.secondName = null;
      this.form.phone = null;
      this.form.password = null;
      this.login.password = null;
      this.fullName = null;
      this.confirm = null;
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

<style lang="sass">
.question
  &::after
    content: "\F29C"
    font-family: FontAwesome
    font-weight: normal
    color: #b9b9b9
form
  display: block
  width: 100%
  max-width: 425px
  margin: auto
  padding:
    bottom: 25px
.form-group
  margin-bottom: 15px
  text-align: left
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
