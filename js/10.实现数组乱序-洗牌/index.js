// function shuffle(arr) {
//   return arr.sort(() => Math.random() - 0.5);
// }

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

console.log(shuffle([1, 2, 3, 4, 5]));
