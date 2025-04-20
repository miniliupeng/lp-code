function getPrime(n) {
  const prime = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime(i)) {
      prime.push(i);
    }
  }
  return prime;
}

function isPrime(n) {
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

console.log(getPrime(10));
