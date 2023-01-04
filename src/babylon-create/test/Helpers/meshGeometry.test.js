import { describe, expect, it, beforeAll } from "vitest";
import { Engine, NullEngine } from "@babylonjs/core/Engines";
import { Scene } from "@babylonjs/core/scene";
import { MeshGeometry } from "../../src/Helpers/meshGeometry";
import { LoadMeshCommand } from "../../src/Commands/MeshCommands";
import { store, stack } from "../../src/Globals";

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
      meshHelper = new MeshGeometry(mesh);
      expect(meshHelper._mesh).toBe(mesh);
      expect(0).toBe(1);
    });
  });
});
