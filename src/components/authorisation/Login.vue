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
  </div>
</template>

<script>
export default {
  name: 'Login',
};
</script>
