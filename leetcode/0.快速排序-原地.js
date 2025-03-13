function quickSortInSpace(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;
  const pivotIndex = partion(arr, left, right);
  quickSortInSpace(arr, left, pivotIndex - 1);
  quickSortInSpace(arr, pivotIndex + 1, right);

  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left;

  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[right]] = [arr[right], arr[i]];

  return i
}

console.log(quickSort([3, 2, 3, 1, 2, 4, 5, 5, 6]));
