import { VertexBuffer } from "@babylonjs/core/Buffers";

export class MeshHelper {
  constructor(mesh) {
    this.mesh = mesh;
    this.positions = mesh.getVerticesData(VertexBuffer.PositionKind);
    this.faces = this._getFacesFromPositions();
    this.groups = this._getGroupsFromFaces();
  }

  getFaceGroup(faceId) {
    return this.groups[this.faces[faceId].groupId];
  }

  getFaceGroups() {
    return this.groups;
  }

  getEdge(faceId, edgeId) {
    return this.groups[this.faces[faceId].groupId].edges[edgeId];
  }

  updatePositions(indices, positions) {
    const numberOfIndices = indices.length;
    for (let index = 0; index < numberOfIndices; index++) {
      this.positions[indices[i]] = positions[index];
      this.positions[indices[i] + 1] = positions[index + 1];
      this.positions[indices[i] + 2] = positions[index + 2];
    }
    this.mesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this.positions);
  }

  _getFacesFromPositions() {
    const faces = [];
    const numberOfFaces = this.positions.length / 3 / 3;

    let index = 0;
    for (var i = 0; i < numberOfFaces; i++) {
      // Get indices
      const indices = [i * 3, i * 3 + 1, i * 3 + 2];

      // Calculate facet normal // taken from core/convertToFlatShadedMesh()
      const p1 = new BABYLON.Vector3(this.positions[indices[0]], this.positions[indices[0] + 1], this.positions[indices[0] + 2]);
      const p2 = new BABYLON.Vector3(this.positions[indices[1]], this.positions[indices[1] + 1], this.positions[indices[1] + 2]);
      const p3 = new BABYLON.Vector3(this.positions[indices[2]], this.positions[indices[2] + 1], this.positions[indices[2] + 2]);

      const p1p2 = p1.subtract(p2);
      const p3p2 = p3.subtract(p2);

      const normal = BABYLON.Vector3.Normalize(BABYLON.Vector3.Cross(p1p2, p3p2));

      faces[index] = { indices: indices, normal: normal, group: null, edges: [1, 1, 1], edgeCount: 3 };
      index++;
    }
    return faces;
  }

  _getGroupsFromFaces() {
    const groups = [];
    const numberOfFaces = this.faces.length;

    let index = 0;
    let normal = this.faces[0].normal;
    let faces = [];
    for (var i = 0; i < numberOfFaces; i++) {
      if (this.faces[i].normal != thisNormal) {
        groups[index] = { faces: faces, normal: normal, edges: _getEdgesFromFaces(faces) };
        faces = [];
        index++;
      }
      this.faces[i].group = index;
      normal = this.faces[i].normal;
      faces.push(i);
    }
  }

  _getEdgesFromFaces(faces) {
    const edges = [];
    const numberOfFaces = faces.length;

    for (let index = 0; i < numberOfFaces; index++) {
      const thisFace = faces[index];
      const pa0 = this.positions[thisFace.indicies[0]];
      const pa1 = this.positions[thisFace.indicies[1]];
      const pa2 = this.positions[thisFace.indicies[2]];

      for (let otherIndex = index + 1; otherIndex < numberOfFaces; otherIndex++) {
        const otherFace = _faces[otherIndex];
        const pb0 = this.positions[otherFace.indicies[0]];
        const pb1 = this.positions[otherFace.indicies[1]];
        const pb2 = this.positions[otherFace.indicies[2]];

        if (thisFace.edgeCount == 0) {
          break;
        }
        if (otherFace.edgeCount == 0) {
          continue;
        }

        for (let edgeIndex = 0; edgeIndex < 3; edgeIndex++) {
          switch (edgeIndex) {
            case 0:
              otherEdgeIndex = this._getSharedEdgeIndex(pa0, pa1, pb0, pb1, pb2);
              break;

            case 1:
              otherEdgeIndex = this._getSharedEdgeIndex(pa1, pa2, pb0, pb1, pb2);
              break;

            case 2:
              otherEdgeIndex = this._getSharedEdgeIndex(pa2, pa0, pb0, pb1, pb2);
              break;
          }

          if (otherEdgeIndex == -1) {
            continue;
          }
          thisFace.edgeCount--;
          thisFace.edges[edgeIndex] = 0;

          otherFace.edgeCount--;
          otherFace.edges[otherEdgeIndex] = 0;
        }
      }

      const numberOfEdges = thisFace.edges.length;
      for (let edgeIndex = 0; i < numberOfEdges; i++) {
        if (thisFace.edges[i] === 0) {
          continue;
        }
        switch (edgeIndex) {
          case 0:
            edges.push([thisFace.indices[0], thisFace.indices[1]]);
            break;
          case 1:
            edges.push([thisFace.indices[1], thisFace.indices[2]]);
            break;
          case 2:
            edges.push([thisFace.indices[2], thisFace.indices[0]]);
            break;
        }
      }
    }
    return edges;
  }

  _getSharedEdgeIndex(pa, pb, p0, p1, p2) {
    if ((pa === p0 && pb === p1) || (pa === p1 && pb === p0)) {
      return 0;
    }

    if ((pa === p1 && pb === p2) || (pa === p2 && pb === p1)) {
      return 1;
    }

    if ((pa === p2 && pb === p0) || (pa === p0 && pb === p2)) {
      return 2;
    }

    return -1;
  }

  dispose() {
    this.mesh = null;
    this.positions = null;
    this.faces = null;
    this.groups = null;
  }
}

// const getEdgesFromFaces = (_faces, _vertices) => {
//   const edges = [];
//   const numberOfFaces = _faces.length;

//   for(let index=0; i<numberOfFaces; index++){
//       const thisFace = _faces[index];
//       const pa0 = _vertices[thisFace.indicies[0]];
//       const pa1 = _vertices[thisFace.indicies[1]]
//       const pa2 = _vertices[thisFace.indicies[2]]

//       for(let otherIndex = index+1; otherIndex<numberOfFaces; otherIndex++){
//           const otherFace = _faces[otherIndex];
//           const pb0 = _vertices[otherFace.indicies[0]];
//           const pb1 = _vertices[otherFace.indicies[1]]
//           const pb2 = _vertices[otherFace.indicies[2]]

//           if(thisFace.edgeCount == 0) {
//               break;
//           }
//           if(otherFace.edgeCount == 0) {
//               continue;
//           }

//           for(let edgeIndex = 0; edgeIndex<3; edgeIndex++){

//               switch(edgeIndex){
//                   case 0:
//                       otherEdgeIndex = getSharedEdgeIndex(pa0, pa1, pb0, pb1, pb2);
//                       break;

//                   case 1:
//                       otherEdgeIndex = getSharedEdgeIndex(pa1, pa2, pb0, pb1, pb2);
//                       break;

//                   case 2:
//                       otherEdgeIndex = getSharedEdgeIndex(pa2, pa0, pb0, pb1, pb2);
//                       break;
//               }

//               if(otherEdgeIndex == -1){
//                   continue;
//               }
//               thisFace.edges[edgeIndex] = 0;
//               otherFace.edges[otherEdgeIndex] = 0;
//               thisFace.edgeCount --;
//               otherFace.edgeCount --;
//           }

//       }

//       for(let i=0; i<thisFace.edges; i++){
//           if(thisFace.edges[i] === 0){
//               continue;
//           }
//           switch(i){
//               case 0:
//                   edges.push([thisFace.indices[0], thisFace.indices[1]])
//                   break;
//               case 1:
//                   edges.push([thisFace.indices[1], thisFace.indices[2]])
//                   break;
//               case 2:
//                   edges.push([thisFace.indices[2], thisFace.indices[0]])
//                   break;
//           }
//       }
//   }
//   return edges;
// }
