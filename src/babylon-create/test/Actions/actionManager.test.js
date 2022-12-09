import { describe, expect, it, beforeAll } from "vitest";
import { Engine, NullEngine } from "@babylonjs/core/Engines";
import { Scene } from "@babylonjs/core/scene";
import { ActionManager } from "../../src/Actions/";
import { store, stack } from "../../src/Globals";

describe("Action Manager functionality", () => {
  let engine;
  let scene;
  let actionManager;

  beforeAll(() => {
    store.clear();
    stack.clear();
    engine = new NullEngine({
      renderHeight: 256,
      renderWidth: 256,
      textureSize: 256,
      deterministicLockstep: false,
      lockstepMaxSteps: 1,
    });
    scene = new Scene(engine);
    store.set("attachedScene", scene);
  });

  it("should initialize", () => {
    actionManager = new ActionManager();
    expect(actionManager).toBeInstanceOf(ActionManager);
    expect(actionManager._enabled).toBe(null);
  });

  it("should enable an addMesh action (will launch moveMesh action directly after", () => {
    store.set("actionRequest", { action: "addMesh", argument: "enabled", value: "cube-aluminum-6061" });
    expect(actionManager._enabled).toBe("moveMesh");
  });

  it("should enable an addMesh action again", () => {
    store.set("actionRequest", { action: "addMesh", argument: "enabled", value: "cube-aluminum-6061" });
    expect(actionManager._enabled).toBe("moveMesh");
    expect(scene.meshes.length).toBe(2)
  });


  it("should enable a moveMesh ", () => {
    store.set("actionRequest", { action: "moveMesh", argument: "enabled", value: "true" });
    expect(actionManager._enabled).toBe("moveMesh");
  });


});
