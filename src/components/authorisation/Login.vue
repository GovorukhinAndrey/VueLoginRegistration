<template>
  <div>
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
        v-model="login.password"
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

    <a href="#" @click.prevent="$emit('move-on-recovery')" class="link">Забыли пароль?</a>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import '@/vue-validate.js';

export default {
  name: 'Login',
  components: {
    ValidationProvider,
  },
  props: {
    reset: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data: () => ({
    passwordFieldType: 'password',
    checkbox: true,
    login: {
      password: null,
      remember: 'Y',
    },
  }),
  watch: {
    reset: 'resetFeild',
    login: {
      handler: function() {
        this.$emit('login-value', this.login);
      },
      deep: true,
    },
    checkbox() {
      this.login.remember = this.checkbox ? 'Y' : 'N';
    },
  },
  methods: {
    resetFeild() {
      return this.reset ? (this.password = null) : false;
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
</style>
