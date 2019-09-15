<template>
  <a href="#" @click.prevent="$emit('move-on-login')" class="link">Вернуться к автризации</a>
</template>

<script>
export default {
  name: 'Recovery',
};
</script>
