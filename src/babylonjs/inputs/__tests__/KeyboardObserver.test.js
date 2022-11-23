import KeyboardObserver from "../KeyboardObserver";
import Config from "../../scenes/editor/config";
import { describe, expect, it, beforeEach } from "vitest";

describe("KeyboardObserver Functionality", () => {
  const keyboardObserver = new KeyboardObserver(null, Config);

  it("should have a config file", () => {
    expect(keyboardObserver._config).toEqual(Config);
  });

  console.log(Config);

  // describe("_processKeys functionality", () => {

  // });

  describe("_mergeKeys functionality", () => {
    beforeEach(() => {
      keyboardObserver._clearKeys();
    });

    it("should return a single key", () => {
      const key = "k";
      keyboardObserver._keystrokes.key = key;
      const result = keyboardObserver._mergeKeys();
      expect(result).toBe(key);
    });

    it("should return a single modifiers", () => {
      keyboardObserver._keystrokes.modifiers.shift = true;
      const result = keyboardObserver._mergeKeys();
      expect(result).toBe("shift");
    });

    it("should return a multiple modifiers", () => {
      keyboardObserver._keystrokes.modifiers.command = true;
      keyboardObserver._keystrokes.modifiers.shift = true;
      const result = keyboardObserver._mergeKeys();
      expect(result).toBe("shift+command");
    });

    it("should return a multiple modifiers and a key", () => {
      keyboardObserver._keystrokes.modifiers.control = true;
      keyboardObserver._keystrokes.modifiers.shift = true;
      keyboardObserver._keystrokes.key = "z";
      const result = keyboardObserver._mergeKeys();
      expect(result).toBe("control+shift+z");
    });
  });
});
