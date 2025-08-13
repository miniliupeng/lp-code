import { ref, watch } from 'vue';

/**
 * 获取一个 ref 变量的前一个值
 * @param {Ref<any>} value - 要追踪的 ref 变量
 * @returns {{ current: Ref<any>, previous: Ref<any> }}
 */
export function usePrevious(value) {
  const previous = ref();

  watch(
    value,
    (newValue, oldValue) => {
      previous.value = oldValue;
    },
    { immediate: false } // 初始时 previous 为 undefined，所以不立即执行
  );

  return { current: value, previous };
}
