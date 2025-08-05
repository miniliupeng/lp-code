var myName = '2';

function bar() {
  console.log(myName);
}

function foo() {
  var myName = '1';

  bar();
}

foo();
