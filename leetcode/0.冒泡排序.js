function bubbleSort(arr) {
  const len = arr.length;
  if (len <= 1) return arr;

  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      // 优化：j < len - i - 1 可以减少不必要的比较
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

console.log(bubbleSort([3, 2, 3, 1, 2, 4, 5, 5, 6]));
