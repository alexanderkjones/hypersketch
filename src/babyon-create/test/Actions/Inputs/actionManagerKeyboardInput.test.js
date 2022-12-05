import { ActionManagerKeyboardInput } from "../../../src/Actions/Inputs";
import { actionManagerConfig } from "../../../src/Actions/";
import { store } from "../../../src/Globals";
import { describe, expect, it, beforeEach } from "vitest";

describe("KeyboardObserver Functionality", () => {
  console.log("hello", ActionManagerKeyboardInput);
  const keyboardObserver = new ActionManagerKeyboardInput(actionManagerConfig.keyboardMapping);

  describe("_processKeys functionality", () => {
    beforeEach(() => {
      keyboardObserver._clearKeys();
    });

    it("should return a move actionRequest", () => {
      keyboardObserver._keystrokes.key = "m";
      const result = keyboardObserver._processKeys();
      expect(result).toMatchObject({
        action: "move",
        argument: "enabled",
        value: "true",
      });
    });

    it("should return an undo actionRequest", () => {
      store.set("actionEnabled", "none");
      keyboardObserver._keystrokes.modifiers.control = true;
      keyboardObserver._keystrokes.key = "z";
      const result = keyboardObserver._processKeys();
      expect(result).toMatchObject({
        action: "undo",
        argument: "enabled",
        value: "true",
      });
    });
  });

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
