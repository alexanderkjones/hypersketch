import { describe, expect, it, beforeEach } from "vitest";
import Editor from "../Editor";

describe("Editor Scene", () => {
  const editor = new Editor();

  it("should initialize", () => {
    expect(editor).toBeInstanceOf(Editor);
  });
  
});