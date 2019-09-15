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
      <span class="form-group__placeholder">
        <span class="form-group__placeholder-input" v-html="placholderFullName"></span>
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
  </div>
</template>

<script>
export default {
  name: 'Registration',
};
</script>
