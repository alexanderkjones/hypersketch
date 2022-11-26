import KeyboardObserver from "../KeyboardObserver";
import Config from "../../scenes/editor/config";
import { describe, expect, it, beforeEach } from "vitest";

class TestActions {
  constructor() {
    this._actionEnabled = null;
  }

  actionEnabled(action, val) {
    if (val) {
      this._actionEnabled = action;
    }
  }

  getActionEnabled() {
    return this._actionEnabled;
  }
}

describe("KeyboardObserver Functionality", () => {
  const actions = new TestActions();
  const keyboardObserver = new KeyboardObserver(actions, Config);

  it("should have a config file", () => {
    expect(keyboardObserver._config).toEqual(Config);
  });

  it("should have a test action set", () => {
    keyboardObserver._actions.actionEnabled("testAction", true);
    expect(keyboardObserver._actions.getActionEnabled()).toBe("testAction");
  });

  describe("_processKeys functionality", () => {
    beforeEach(() => {
      keyboardObserver._clearKeys();
      keyboardObserver._actions.actionEnabled(null, true);
    });

    it("should return an add actionRequest", () => {
      keyboardObserver._actions.actionEnabled("add", true);
      keyboardObserver._keystrokes.key = "enter";
      const result = keyboardObserver._processKeys();
      expect(result).toMatchObject({
        action: "add",
        argument: "complete",
        value: "true",
      });
    });

    it("should return an undo actionRequest", () => {
      keyboardObserver._actions.actionEnabled("none", true);
      keyboardObserver._keystrokes.modifiers.control = true;
      keyboardObserver._keystrokes.key = "z";
      const result = keyboardObserver._processKeys();
      expect(result).toMatchObject({
        action: "default",
        argument: "undo",
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
