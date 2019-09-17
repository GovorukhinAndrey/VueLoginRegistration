<template>
  <div>
    <ValidationProvider
      class="form-group"
      tag="div"
      name="ФИО"
      :rules="{
        fullName: /^[a-zA-Zа-яА-ЯёЁ]+ [a-zA-Zа-яА-ЯёЁ]+ [a-zA-Zа-яА-ЯёЁ]+$/,
      }"
      v-slot="{ errors, classes, validate }"
    >
      <label for="fullName" class="form-group__title">
        ФИО
      </label>
      <span
        class="question"
        content="Служба доставки выдаст заказ по паспорту"
        v-tippy="{ trigger: 'click' }"
      ></span>
      <span class="form-group placeholder">
        <span class="form-group placeholder-input" v-html="placholderFullName"></span>
        <input
          id="fullName"
          :class="classes"
          class="form-group__input"
          :value="fullName"
          @input="
            fullName = $event.target.value;
            validate($event);
          "
          type="text"
        />
      </span>
      <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider
      class="form-group"
      tag="div"
      name="Телефон"
      :bails="false"
      :rules="{ phoneNum: true, phoneMin: 10 }"
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
        v-model="registration.phone"
      />
      <span v-if="errors[0]" class="form-group__error">{{ errors[0] }}</span>
    </ValidationProvider>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate';
import '@/vue-validate.js';

export default {
  name: 'Registration',
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
    fullName: null,
    placeholder: {
      name: 'Имя',
      lastName: 'Фамилия',
      secondName: 'Отчество',
    },
    registration: {
      lastName: '',
      name: '',
      secondName: '',
      phone: '',
    },
  }),
  watch: {
    fullName: 'watchingFullName',
    registration: {
      handler: function() {
        this.$emit('reg-value', this.registration);
      },
      deep: true,
    },
    reset: 'resetFeild',
  },
  computed: {
    placholderFullName() {
      return `${this.placeholder.lastName} ${this.placeholder.name} ${this.placeholder.secondName}`;
    },
  },
  methods: {
    resetFeild() {
      if (this.reset) {
        this.fullName = null;
        this.registration.phone = null;
      } else {
        return false;
      }
    },
    submitValue() {
      console.log('вызов в submitValue');
      this.$emit('submit-value', this.form);
    },
    watchingFullName() {
      let fullName = this.fullName;
      let arrFullName = this.fullName ? fullName.split(' ') : [];

      this.setFieldsName(arrFullName);
      this.checkPlaceholder(arrFullName);
    },
    setFieldsName([lastName = null, name = null, secondName = null]) {
      this.registration.lastName = lastName;
      this.registration.name = name;
      this.registration.secondName = secondName;
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
  },
};
</script>

<style lang="sass" scoped>
.question
  cursor: pointer
  &::after
    content: "\F29C"
    font-family: FontAwesome
    font-weight: normal
    color: #b9b9b9
.placeholder
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
</style>
