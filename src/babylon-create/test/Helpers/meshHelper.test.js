import { describe, expect, it, beforeAll } from "vitest";
import { Engine, NullEngine } from "@babylonjs/core/Engines";
import { Scene } from "@babylonjs/core/scene";
import { MeshHelper } from "../../src/Helpers/";
import { LoadMeshCommand } from "../../../src/Commands/MeshCommands";

describe("Mesh Helper functionality", () => {
  let engine;
  let scene;
  let meshHelper;
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
  });

  describe("Add basic mesh and initialize MeshHelper", () => {
    const meshID = "cube-aluminum-6061";

    it("should initialize", () => {
      mesh = stack.execute(new LoadMeshCommand(meshID));
      meshHelper = new MeshHelper(mesh);
      expect(meshHelper.mesh).toBe(mesh);
    });
  });
});
