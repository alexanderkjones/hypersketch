import { describe, expect, it, beforeAll } from "vitest";
import { Engine, NullEngine } from "@babylonjs/core/Engines";
import { Scene } from "@babylonjs/core/scene";
import { store, stack } from "../../../src/Globals";
import { AddMeshAction } from "../../../src/Actions/MeshActions";

describe("AddMeshAction Functionality", () => {
  let engine;
  let scene;

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

  describe("AddMeshAction Base Case", () => {
    const addMeshAction = new AddMeshAction();
    const meshID = "cube-aluminum-6061";
    const actionRequest = {
      action: "addMesh",
      argument: "enabled",
      value: meshID,
      options: {},
    };

    it("should initialize", () => {
      expect(addMeshAction).toBeInstanceOf(AddMeshAction);
      expect(addMeshAction._scene).toBe(scene);
    });

    it("should load a mesh", () => {
      addMeshAction.process(actionRequest);
      expect(1).toBe(scene.meshes.length);
      expect(meshID).toBe(scene.meshes[0].name);
    });

    it("should undo", () => {
      stack.undo();
      expect(0).toBe(scene.meshes.length);
    });

    it("should redo", () => {
      stack.redo();
      expect(1).toBe(scene.meshes.length);
      expect(meshID).toBe(scene.meshes[0].name);
    });
  });

  describe("AddMeshAction Base Case", () => {
    
  });
});
