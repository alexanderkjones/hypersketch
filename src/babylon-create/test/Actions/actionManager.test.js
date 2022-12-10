import { describe, expect, it, beforeAll } from "vitest";
import { Engine, NullEngine } from "@babylonjs/core/Engines";
import { Scene } from "@babylonjs/core/scene";
import { UtilityLayerRenderer } from "@babylonjs/core/Rendering/utilityLayerRenderer";
import { ActionManager } from "../../src/Actions/";
import { store, stack } from "../../src/Globals";

describe("Action Manager functionality", () => {
  let engine;
  let scene;
  let mesh;
  let utilityLayerScene;
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
    utilityLayerScene = UtilityLayerRenderer.DefaultUtilityLayer.utilityLayerScene;
    store.set("attachedScene", scene);
  });

  it("should initialize", () => {
    actionManager = new ActionManager();
    expect(actionManager).toBeInstanceOf(ActionManager);
    expect(actionManager._enabled).toBe(null);
  });

  it("should enable an addMesh action (will launch moveMesh action directly after", () => {
    store.set("actionRequest", { action: "addMesh", argument: "enabled", value: "cube-aluminum-6061" });
    mesh = store.get("attachedMesh");
    expect(actionManager._enabled).toBe("moveMesh");
  });

  it("BUGFIX: should enable an addMesh action again", () => {
    store.set("actionRequest", { action: "addMesh", argument: "enabled", value: "cube-aluminum-6061" });
    expect(actionManager._enabled).toBe("moveMesh");
    expect(scene.meshes.length).toBe(2)
    expect(store.get("attachedMesh")).not.toBe(mesh);
  });

  it("BUGFIX: should have attached attachMesh to moveMesh", ()=>{
    const attachedMesh = store.get("attachedMesh");
    const action = actionManager.getActionEnabled();
    console.log("hello", action);
    expect(action.instance._attachedMesh).toBe(attachedMesh);
  });

 


  // it("should enable a moveMesh ", () => {
  //   store.set("actionRequest", { action: "moveMesh", argument: "enabled", value: "true" });
  //   expect(actionManager._enabled).toBe("moveMesh");
  // });



  // it("should enable a rotateMesh ", () => {
  //   store.set("actionRequest", { action: "rotateMesh", argument: "enabled", value: "true" });
  //   expect(actionManager._enabled).toBe("rotateMesh");
  //   expect(store.get("attachedMesh")).toBe(attachedMesh);
  // });

  // it("should enable a scaleMesh ", () => {
  //   store.set("actionRequest", { action: "scaleMesh", argument: "enabled", value: "true" });
  //   expect(actionManager._enabled).toBe("scaleMesh");
  //   expect(store.get("attachedMesh")).toBe(attachedMesh);
  // });

  // it("should enable a moveMesh ", () => {
  //   store.set("actionRequest", { action: "moveMesh", argument: "enabled", value: "true" });
  //   expect(actionManager._enabled).toBe("moveMesh");
  //   expect(store.get("attachedMesh")).toBe(attachedMesh);
  // });




});
