import { describe, expect, it, beforeAll } from "vitest";
import { Engine, NullEngine } from "@babylonjs/core/Engines";
import { Scene } from "@babylonjs/core/scene";
import { store, stack } from "../../../src/Globals";
import { MoveMeshAction } from "../../../src/Actions/MeshActions";
import { LoadMeshCommand } from "../../../src/Commands/MeshCommands";

describe("MoveMeshAction Functionality", () => {
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

  describe("MoveMeshAction Base Case", () => {
    const moveMeshAction = new MoveMeshAction();
    const meshID = "cube-aluminum-6061";
    let mesh = null;

    it("should initialize", () => {
      expect(moveMeshAction).toBeInstanceOf(MoveMeshAction);
      expect(moveMeshAction._attachedMesh).toBe(null);
    });

    it("should attach to attachedMesh", () => {
      mesh = stack.execute(new LoadMeshCommand(meshID));
      store.set("attachedMesh", mesh);
      expect(moveMeshAction._attachedMesh).toBe(mesh);
      expect(moveMeshAction._gizmo.attachedMesh).toBe(mesh);
    });

    it("should process set command and move attachedMesh", () => {
      const [newX, newY, newZ] = [Math.random(), Math.random(), Math.random()];
      const request = { action: "moveMesh", argument: "set", value: [newX, newY, newZ] };
      moveMeshAction.process(request);
      expect(mesh.position.x).toBe(newX);
      expect(mesh.position.y).toBe(newY);
      expect(mesh.position.z).toBe(newZ);
    });
  });
});
