import { describe, expect, it, beforeEach } from "vitest";
import { store } from "../Store";

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
      const myValue = store.get("test");
      expect(myValue).toBe(123);
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
      }

      setValue = (value) => {
        this.value = value;
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

    it("should notify", () => {
      store.set("test", 456);
      expect(watcher.value).toBe(456);
    });

    it("should unwatch", () => {
      store.unwatch("test", watcher);
      store.set("test", 123);
      expect(watcher.value).toBe(456);
    });
  });
});
