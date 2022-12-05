import { describe, expect, it, beforeEach } from "vitest";
import EditorApplication from "../../src/Applications";

describe("Editor Scene", () => {
  const editor = new EditorApplication();

  it("should initialize", () => {
    expect(editor).toBeInstanceOf(EditorApplication);
  });
});
