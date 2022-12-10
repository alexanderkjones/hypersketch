import { describe, expect, it, beforeAll } from "vitest";
import { Engine, NullEngine } from "@babylonjs/core/Engines";
import { Scene } from "@babylonjs/core/scene";
import { store, stack } from "../../../src/Globals";
import { CloneMeshAction } from "../../../src/Actions/MeshActions";
import { LoadMeshCommand } from "../../../src/Commands/MeshCommands";

describe("CloneMeshAction Functionality", () => {
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

  describe("CloneMeshAction Base Case", () => {
    const cloneMeshAction = new CloneMeshAction();
    const meshID = "cube-aluminum-6061";
    const actionRequest = {
      action: "cloneMesh",
      argument: "enabled",
      value: true,
      options: {},
    };

    it("should initialize", () => {
      expect(cloneMeshAction).toBeInstanceOf(CloneMeshAction);
      expect(cloneMeshAction._scene).toBe(scene);
    });

    it("should clone a mesh", () => {
      const mesh = stack.execute(new LoadMeshCommand(meshID));
      store.set("attachedMesh", mesh);
      cloneMeshAction.process(actionRequest);
      expect(2).toBe(scene.meshes.length);
      expect(meshID).toBe(scene.meshes[0].name);
      expect(meshID).toBe(scene.meshes[1].name);
    });

    it("should clone a second mesh", () => {
      cloneMeshAction.process(actionRequest);
      scene.meshes.map((mesh) => {
        console.log(mesh.name);
      });
      expect(3).toBe(scene.meshes.length);
      expect(meshID).toBe(scene.meshes[0].name);
      expect(meshID).toBe(scene.meshes[1].name);
      expect(meshID).toBe(scene.meshes[2].name);
    });

    it("should undo", () => {
      stack.undo();
      stack.undo();
      expect(1).toBe(scene.meshes.length);
    });

    it("should redo", () => {
      stack.redo();
      stack.redo();
      expect(3).toBe(scene.meshes.length);
      expect(meshID).toBe(scene.meshes[0].name);
    });
  });
});
