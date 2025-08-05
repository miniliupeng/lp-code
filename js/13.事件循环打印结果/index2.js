async function foo() {
  console.log(1);
  
  let p = new Promise((resolve, reject) => setTimeout(() => resolve(3), 1000));

  console.log(await p);
  console.log('await p run');
}

foo();

console.log('foo afer run');
