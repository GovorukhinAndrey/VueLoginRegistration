import { extend } from 'vee-validate';
import { required, email, min, regex, numeric } from 'vee-validate/dist/rules';

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

extend('phoneMin', {
  ...min,
  message: 'введите больше 10 символов',
});

extend('phoneNum', {
  ...numeric,
  message: 'вводите цифры без пробела',
});
