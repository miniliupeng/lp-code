class Subject {
  constructor() {
    this.observers = [];
    console.log('Publisher created');
  }

  subscibe(observer) {
    console.log('Publisher.add invoked');
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    console.log('Publisher.remove invoked');
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify() {
    console.log('Publisher.notify invoked');
    this.observers.forEach((observer) => {
      observer.update();
    });
  }
}

class Observer {
  constructor() {
    console.log('Observer created');
  }

  update() {
    console.log('Observer.update invoked');
  }
}
