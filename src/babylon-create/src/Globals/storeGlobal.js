class Store {
  constructor() {
    this._store = {};
    this._observers = {};
    this._debug = false;
  }

  set(key, value, setter = null) {
    this._store[key] = value;
    if (!(key in this._observers)) {
      this._observers[key] = {};
    }
    for (const observer in this._observers[key]) {
      const callback = this._observers[key][observer];
      const result = callback(value);
    }
  }

  get(key) {
    if (key in this._store) {
      return this._store[key];
    } else {
      return null;
    }
  }

  watch(key, object, callback) {
    const objectName = object.constructor.name;
    if (!(key in this._observers)) {
      this._observers[key] = {};
    }
    if (this._observers[key][objectName]) {
      return { error: "cannot register watcher multiple times" };
    }
    this._observers[key][objectName] = callback;
    callback(this.get(key));
  }

  unwatch(key, object) {
    const objectName = object.constructor.name;
    if (this._observers[key][objectName]) {
      delete this._observers[key][objectName];
    }
  }

  clear() {
    for (const data in this._store) {
      delete this._store[data];
    }
  }
}

export const store = new Store();
