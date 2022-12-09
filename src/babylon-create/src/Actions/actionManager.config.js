export const actionManagerConfig = {
  keyboardMapping: {
    g: {
      action: "grabMesh",
      argument: "enabled",
      value: "true",
    },
    m: {
      action: "moveMesh",
      argument: "enabled",
      value: "true",
    },
    s: {
      action: "scaleMesh",
      argument: "enabled",
      value: "true",
    },
    r: {
      action: "rotateMesh",
      argument: "enabled",
      value: "true",
    },
    e: {
      action: "extend",
      argument: "enabled",
      value: "true",
    },
    j: {
      action: "joint",
      argument: "enabled",
      value: "true",
    },
    "control+c": {
      action: "cloneMesh",
      argument: "enabled",
      value: "true",
    },
    "control+z": {
      action: "undo",
      argument: "enabled",
      value: "true",
    },
    "shift+control+z": {
      action: "redo",
      argument: "enabled",
      value: "true",
    },
  },
};
