import { describe, expect, it, beforeEach } from "vitest";
import { store } from "../../src/Globals";

describe("Store Functionality", () => {
  describe("Basic Functionality", () => {
    it("should initialize", () => {
      expect(store).toHaveProperty("_store", {});
      expect(store).toHaveProperty("_observers", {});
    });

    it("should set a value", () => {
      store.set("test", 123);
      store.set("test2", 234);
      expect(store._store).toHaveProperty("test", 123);
      expect(store._store).toHaveProperty("test2", 234);
    });

    it("should get a value", () => {
      let myValue = store.get("test");
      expect(myValue).toBe(123);
      myValue = store.get("test2");
      expect(myValue).toBe(234);
    });

    it("should clear all values", () => {
      store.clear();
      expect(store).toHaveProperty("_store", {});
    });
  });

  describe("PubSub Functionality", () => {
    class Watcher {
      constructor() {
        this.value = null;
        this.otherValue = null;
      }

      setValue = (value) => {
        this.value = value;
      };

      setOtherValue = (value) => {
        this.otherValue = value;
      };
    }

    const watcher = new Watcher();

    it("should watch", () => {
      store.set("test", 123);
      store.watch("test", watcher, watcher.setValue);
      expect(store).toHaveProperty("_store", { test: 123 });
      expect(store._observers).toHaveProperty("test");
      expect(watcher.value).toBe(123);
    });

    it("should only watch once", () => {
      const numberOfTestWatchers = store._observers["test"].length;
      store.watch("test", watcher, watcher.setValue);
      expect(store._observers["test"].length).toBe(numberOfTestWatchers);
    });

    it("should notify", () => {
      store.set("test", 456);
      expect(watcher.value).toBe(456);
    });

    it("should unwatch by topic", () => {
      store.unwatch("test", watcher);
      store.set("test", 123);
      expect(watcher.value).toBe(456);
    });

    it("should unwatch all", () => {
      const numberOfWatchers = (item) => {
        return Object.keys(store._observers[item]).length;
      };

      store.watch("a", watcher, watcher.setValue);
      store.watch("b", watcher, watcher.setValue);
      store.watch("c", watcher, watcher.setValue);

      expect(numberOfWatchers("a")).toBe(1);
      expect(numberOfWatchers("b")).toBe(1);
      expect(numberOfWatchers("c")).toBe(1);

      store.unwatchAll(watcher);

      expect(numberOfWatchers("a")).toBe(0);
      expect(numberOfWatchers("b")).toBe(0);
      expect(numberOfWatchers("c")).toBe(0);
    });
  });
});
