<template>
  <div>
    <h1>usePrevious Hook 示例</h1>
    <p>当前值 (Current): {{ current }}</p>
    <p>之前的值 (Previous): {{ previous === undefined ? 'undefined' : previous }}</p>
    <button @click="increment">增加</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePrevious } from './usePrevious.js';

const count = ref(0);
const { current, previous } = usePrevious(count);

const increment = () => {
  count.value++;
};
</script>

<style scoped>
div {
  font-family: sans-serif;
  text-align: center;
  padding: 2rem;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
