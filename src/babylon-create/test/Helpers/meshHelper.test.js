import { describe, expect, it, beforeAll } from "vitest";
import { Engine, NullEngine } from "@babylonjs/core/Engines";
import { Scene } from "@babylonjs/core/scene";
import { MeshHelper } from "../../src/Helpers/";
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
      meshHelper = new MeshHelper(mesh);
      expect(meshHelper.mesh).toBe(mesh);
    });
  });

  describe("Geometry Requests", () => {
    it("should return provided cube geometry data", () => {
      expect(meshHelper.getIndices().length).toBe(36);
    });

    it("should return all faces", () => {
      expect(meshHelper.getFaces().length).toBe(12);
    });

    it("should return a given face by id", () => {
      const face = meshHelper.getFace(6);
      expect(face).toHaveProperty("indices");
      expect(face).toHaveProperty("normal");
    });

    it("should return all face groups", () => {
      const faceGroups = meshHelper.getFaceGroups();
      let i = 0;
      for(const face of meshHelper.getFaces()){
        console.log("face", i)
        for(const index of face.indices){
          console.log(meshHelper.getVertex(index))
        }
        console.log(face.normal);
        i++;
      }
      expect(faceGroups.length).toBe(6);
    });
  });
});
