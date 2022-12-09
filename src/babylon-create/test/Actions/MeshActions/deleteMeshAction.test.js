import { describe, expect, it, beforeAll } from "vitest";
import { Vector3 } from "@babylonjs/core/Maths";
import { Engine, NullEngine } from "@babylonjs/core/Engines";
import { Scene } from "@babylonjs/core/scene";
import { store, stack } from "../../../src/Globals";
import { AddMeshAction, DeleteMeshAction } from "../../../src/Actions/MeshActions";

describe("DeleteMeshAction Functionality", () => {
  let engine;
  let scene;
  let mesh;

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

    const addMeshAction = new AddMeshAction();
    const meshID = "cube-aluminum-6061";
    const addActionRequest = {
      action: "addMesh",
      argument: "enabled",
      value: meshID,
    };
    addMeshAction.process(addActionRequest);
  });

  describe("DeleteMeshAction Base Case", () => {
    const deleteMeshAction = new DeleteMeshAction();

    const meshState = {
      name: "cube-aluminum-6061",
      position: new Vector3(0, 1, 0),
      scaling: new Vector3(3, 3, 3),
      rotation: new Vector3(Math.PI, Math.PI / 2, Math.PI / 3),
      metadata: { sampleData: "testing meta 1", sampleData2: "testin meta 2" },
    };

    it("should initialize", () => {
      expect(deleteMeshAction).toBeInstanceOf(DeleteMeshAction);
      expect(deleteMeshAction._scene).toBe(scene);
    });

    it("should delete a mesh", () => {
      mesh = scene.meshes[0];
      mesh.position = meshState.position;
      mesh.scaling = meshState.scaling;
      mesh.rotation = meshState.rotation;
      mesh.metadata = meshState.metadata;
      store.set("attachedMesh", mesh);

      const deleteActionRequest = {
        action: "deleteMesh",
        argument: "enabled",
        value: true,
      };

      deleteMeshAction.process(deleteActionRequest);
      expect(0).toBe(scene.meshes.length);
      expect(store.get("attachedMesh")).toBe(null);
    });

    it("should undo", () => {
      stack.undo();
      mesh = scene.meshes[0];
      expect(1).toBe(scene.meshes.length);
      expect(mesh.name).toBe(meshState.name);
      expect(mesh.position).toStrictEqual(meshState.position);
      expect(mesh.rotation).toStrictEqual(meshState.rotation);
      expect(mesh.scaling).toStrictEqual(meshState.scaling);
      expect(mesh.metadata).toStrictEqual(meshState.metadata);
    });

    it("should redo", () => {
      stack.redo();
      expect(0).toBe(scene.meshes.length);
    });
  });
});
