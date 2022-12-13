import { Vector3 } from "@babylonjs/core";
import { VertexBuffer } from "@babylonjs/core/Buffers";

export class MeshHelper {
  constructor(mesh) {
    this.mesh = mesh;
    this._indices = mesh.getIndices();
    this._positions = mesh.getVerticesData(VertexBuffer.PositionKind);
    this._faces = this._getFacesFromPositions();
    this._groups = this._getGroupsFromFaces();
  }

  getIndices() {
    return this._indices;
  }

  getPositions() {
    return this._positions;
  }

  getVertex(index) {
    return [this._positions[index * 3], this._positions[index * 3 + 1], this._positions[index * 3 + 2]];
  }

  getVertices() {
    const vertices = [];
    const numberOfVertices = this._indices.length;
    for (let i = 0; i < numberOfVertices; i++) {
      vertices[i] = this.getVertex(i);
    }
    return vertices;
  }

  getFaces() {
    return this._faces;
  }

  getFace(faceId) {
    return this._faces[faceId];
  }

  // getFaceGroup(faceId) {
  //   return this.groups[this.faces[faceId].groupId];
  // }

  getFaceGroups() {
    return this._groups;
  }

  // getEdge(faceId, edgeId) {
  //   return this.groups[this.faces[faceId].groupId].edges[edgeId];
  // }

  // updatePositions(indices, positions) {
  //   const numberOfIndices = indices.length;
  //   for (let index = 0; index < numberOfIndices; index++) {
  //     this.positions[indices[i]] = positions[index];
  //     this.positions[indices[i] + 1] = positions[index + 1];
  //     this.positions[indices[i] + 2] = positions[index + 2];
  //   }
  //   this.mesh.updateVerticesData(VertexBuffer.PositionKind, this.positions);
  // }

  _getFacesFromPositions() {
    const faces = [];
    const numberOfFaces = this._indices.length / 3;

    for (var i = 0; i < numberOfFaces; i++) {
      // Get indices
      const indices = [i + 0, i + 1, i + 2];

      // Get vertices
      const p1 = new Vector3(...this.getVertex(indices[0]));
      const p2 = new Vector3(...this.getVertex(indices[1]));
      const p3 = new Vector3(...this.getVertex(indices[2]));

      // Calculate facet normal // taken from core/convertToFlatShadedMesh()
      const p1p2 = p1.subtract(p2);
      const p3p2 = p3.subtract(p2);
      const normal = Vector3.Normalize(Vector3.Cross(p1p2, p3p2));

      faces[i] = { indices: indices, normal: normal, group: null, edges: [1, 1, 1], edgeCount: 3 };
    }
    return faces;
  }

  _getGroupsFromFaces() {
    const groups = [];
    const numberOfFaces = this._faces.length;
    const epsilon = Math.pow(10, -6);

    let index = 0;
    let normal = this._faces[0].normal;
    let faces = [];
    for (var i = 0; i < numberOfFaces; i++) {
      if (!this._faces[i].normal.equalsWithEpsilon(normal, epsilon)) {
        groups[index] = { faces: faces, normal: normal };

        //groups[index] = { faces: faces, normal: normal, edges: _getEdgesFromFaces(faces) };
        faces = [];
        index++;
      }
      faces.push(i);
      normal = this._faces[i].normal;
      this._faces[i].group = index;
    }
    return groups;
  }

  // _getEdgesFromFaces(faces) {
  //   const edges = [];
  //   const numberOfFaces = faces.length;

  //   for (let index = 0; i < numberOfFaces; index++) {
  //     const thisFace = faces[index];
  //     const pa0 = this.positions[thisFace.indicies[0]];
  //     const pa1 = this.positions[thisFace.indicies[1]];
  //     const pa2 = this.positions[thisFace.indicies[2]];

  //     for (let otherIndex = index + 1; otherIndex < numberOfFaces; otherIndex++) {
  //       const otherFace = _faces[otherIndex];
  //       const pb0 = this.positions[otherFace.indicies[0]];
  //       const pb1 = this.positions[otherFace.indicies[1]];
  //       const pb2 = this.positions[otherFace.indicies[2]];

  //       if (thisFace.edgeCount == 0) {
  //         break;
  //       }
  //       if (otherFace.edgeCount == 0) {
  //         continue;
  //       }

  //       for (let edgeIndex = 0; edgeIndex < 3; edgeIndex++) {
  //         switch (edgeIndex) {
  //           case 0:
  //             otherEdgeIndex = this._getSharedEdgeIndex(pa0, pa1, pb0, pb1, pb2);
  //             break;

  //           case 1:
  //             otherEdgeIndex = this._getSharedEdgeIndex(pa1, pa2, pb0, pb1, pb2);
  //             break;

  //           case 2:
  //             otherEdgeIndex = this._getSharedEdgeIndex(pa2, pa0, pb0, pb1, pb2);
  //             break;
  //         }

  //         if (otherEdgeIndex == -1) {
  //           continue;
  //         }
  //         thisFace.edgeCount--;
  //         thisFace.edges[edgeIndex] = 0;

  //         otherFace.edgeCount--;
  //         otherFace.edges[otherEdgeIndex] = 0;
  //       }
  //     }

  //     const numberOfEdges = thisFace.edges.length;
  //     for (let edgeIndex = 0; i < numberOfEdges; i++) {
  //       if (thisFace.edges[i] === 0) {
  //         continue;
  //       }
  //       switch (edgeIndex) {
  //         case 0:
  //           edges.push([thisFace.indices[0], thisFace.indices[1]]);
  //           break;
  //         case 1:
  //           edges.push([thisFace.indices[1], thisFace.indices[2]]);
  //           break;
  //         case 2:
  //           edges.push([thisFace.indices[2], thisFace.indices[0]]);
  //           break;
  //       }
  //     }
  //   }
  //   return edges;
  // }

  // _getSharedEdgeIndex(pa, pb, p0, p1, p2) {
  //   if ((pa === p0 && pb === p1) || (pa === p1 && pb === p0)) {
  //     return 0;
  //   }

  //   if ((pa === p1 && pb === p2) || (pa === p2 && pb === p1)) {
  //     return 1;
  //   }

  //   if ((pa === p2 && pb === p0) || (pa === p0 && pb === p2)) {
  //     return 2;
  //   }

  //   return -1;
  // }

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
