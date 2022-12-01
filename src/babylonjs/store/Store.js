export default class Store {
  constructor() {
    this._store = {};
    this._observers = {};
  }

  set(key, value) {
    this._store[key] = value;
    if (!(key in this._observers)) {
      this._observers[key] = [];
    }
    for (const observer of this._observers[key]) {
      observer.callback(value);
    }
  }

  get(key) {
    return this._store[key];
  }

  watch(key, id, callback) {
    this._observers[key].push({ id: id, callback: callback });
  }

  unwatch(key, id) {
    for (let i = 0; i < this._observers[key].length; i++) {
      if (this._observers[key][i].id === id) {
        this._observers[key].splice(i, 1);
      }
    }
  }

  clear() {
    for (const data in this._store) {
      delete this._store[data];
    }
  }
}
