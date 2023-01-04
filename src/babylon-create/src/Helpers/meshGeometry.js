import { Vector3 } from "@babylonjs/core";
import { VertexBuffer } from "@babylonjs/core/Buffers";

export class MeshGeometry {
  constructor(mesh) {
    this._mesh = mesh;
    this._positions = mesh.getVerticesData(VertexBuffer.PositionKind);
    this._indices = this._mesh.getIndices();
    //this._scene = mesh.getScene();
    this.vertices = this.buildVertices();
    this.facets = this.buildFacets();
    //this.faces = this.buildFaces();
  }

  dispose = () => {
    // Remove all face meshes from scene
    for (let i = 0; i < this.faces.length; i++) {
      let face = this.faces[i];
      if (face.mesh) {
        face.mesh.dispose();
      }
    }
  };

  buildVertices = () => {
    let indices = this._mesh.getIndices();
    let positions = this._mesh.getVerticesData(VertexBuffer.PositionKind);

    // Pack vertices into Vector3
    let vertices = [];
    for (let i = 0; i < indices.length; i++) {
      let localVertex = Vector3.FromArray(positions, 3 * indices[i]);
      ///console.log(indices[i], ":", i)
      let globalVertex = Vector3.TransformCoordinates(localVertex, this._mesh.getWorldMatrix());
      vertices.push(localVertex);
    }
    return vertices;
  };

  getVertex(index) {
    const i = 3 * this._indices[index];
    return [this._positions[i], this._positions[i + 1], this._positions[i + 2]];
  }

  buildFacets = () => {
    let facets = [];
    //let numFacets = this.vertices.length / 3;
    const numFacets = this._mesh.getIndices().length / 3;
    console.log(numFacets);

    // Group vertices by faceID and get normal
    for (let i = 0; i < numFacets; i++) {
      let offset = i * 3;
      const verticesLookup = [0 + offset, 1 + offset, 2 + offset];

      // Get indices
      const indices = [i * 3 + 0, i * 3 + 1, i * 3 + 2];

      // Calculate facet normal // taken from core/convertToFlatShadedMesh()
      // const p1 = this.vertices[indices[0]];
      // const p2 = this.vertices[indices[1]];
      // const p3 = this.vertices[indices[2]];

      const p1 = new Vector3(...this.getVertex(indices[0]));
      const p2 = new Vector3(...this.getVertex(indices[1]));
      const p3 = new Vector3(...this.getVertex(indices[2]));

      console.log("face: ", i);
      console.log("[", p1.asArray().toString(), "]");
      console.log("[", p2.asArray().toString(), "]");
      console.log("[", p3.asArray().toString(), "]");

      const p1p2 = p1.subtract(p2);
      const p3p2 = p3.subtract(p2);

      const normal = Vector3.Normalize(Vector3.Cross(p1p2, p3p2));
      console.log("[", normal.asArray().toString(), "]");
      console.log("");
      // Push facet vertices lookup and  normal
      let facet = {
        vertices: verticesLookup,
        normal: normal,
        face: null,
      };
      facets.push(facet);
    }

    return facets;
  };

  // buildFaces = () => {
  //     let faces = [];
  //     let numFacets = this.vertices.length/3;
  //     let lastFacet = numFacets-1;

  //     let face = {
  //         id: null,
  //         facets: [],
  //         edges: [],
  //         mesh: null,
  //     };
  //     let thisFaceId = 0;
  //     let nextFaceId = 0;
  //     const epsilon = Math.pow(10, -6);

  //     // Construct face data
  //     for(let i=0; i<numFacets; i++){

  //         // Add this facet to this face group
  //         face.facets.push(i);

  //         // Add face lookup to this facet
  //         this.facets[i].face = thisFaceId;

  //         // Check to advance next face id if facet does not have similar normal
  //         if(i !== lastFacet){
  //             if(!this.facets[i].normal.equalsWithEpsilon(this.facets[i+1].normal, epsilon)){
  //                 // Store face normal and advance nextFaceID
  //                 nextFaceId ++;
  //             }
  //         }

  //         // Build face group mesh if next facet has different normal
  //         // signifying new face group or we're at the last facet
  //         if(thisFaceId !== nextFaceId|| i == lastFacet){

  //             // Add ID and normal to face
  //             face.id = thisFaceId;
  //             face.normal = this.facets[i].normal;

  //             // Add face to faces
  //             faces.push(face);
  //             thisFaceId ++;

  //             // Reset face
  //             face = {
  //                 id: null,
  //                 facets: [],
  //                 edges: [],
  //                 normal: null,
  //                 mesh: null,
  //             };
  //         }
  //     }

  //     return faces;
  // }

  // getFace = (facetId) => {
  //     // Get face from facet id
  //     let face = this.faces[this.facets[facetId].face];

  //     if (!face.mesh){
  //         // Create mesh for face
  //         face.mesh = new Mesh("face", this._scene);
  //         face.mesh.isPickable = false;
  //         face.mesh.isVisible = false;

  //         // Prepare to unpack indices and positions from face group
  //         let indices = []
  //         let positions = []
  //         let index = 0

  //         // Loop through facets
  //         for(let i=0; i<face.facets.length; i++){

  //             // Get this facet
  //             let facet = this.facets[face.facets[i]]

  //             // Loop through facet vertices
  //             for(let j=0; j<facet.vertices.length; j++){

  //                 // Append indices to custom mesh
  //                 indices.push(index)
  //                 index++

  //                 // Get this vertex from lookup
  //                 let vertex = this.vertices[facet.vertices[j]];

  //                 // Append positions to custom mesh
  //                 positions.push(vertex.x)
  //                 positions.push(vertex.y)
  //                 positions.push(vertex.z)
  //             }
  //         }

  //         // Add vertex data to face mesh
  //         let data = new VertexData();
  //         data.positions = positions;
  //         data.indices = indices;
  //         data.applyToMesh(face.mesh);
  //     }
  //     return face;
  // }

  // getEdges = (facetId) => {

  //     // Get face from facetId
  //     let face = this.faces[this.facets[facetId].face];

  //     // Stringify vertices of this face to compare shared vertices
  //     let strVertices = [];
  //     let strVerticesLookup = [];
  //     let idVerticesLookup = [];

  //     // Loop through facets from this face
  //     for (let i=0; i<face.facets.length; i++){
  //         let facet = this.facets[face.facets[i]];

  //         // Loop through vertices of each facet
  //         for (let k=0; k<facet.vertices.length; k++) {
  //             let v = this.vertices[facet.vertices[k]]

  //             // Stringify vertex for indexof lookup
  //             let strV = v.x + ', ' + v.y + ', ' + v.z;
  //             let strVIndex = strVertices.indexOf(strV);

  //             // Store strV if this is its first occurance and save vertex id
  //             if (strVIndex == -1) {
  //                 strVertices.push(strV);
  //                 strVIndex = strVertices.length - 1;
  //                 idVerticesLookup.push(facet.vertices[k]);

  //             }

  //             strVerticesLookup.push(strVIndex);

  //         }

  //     }

  //     console.log('strVerticesLookup ',strVerticesLookup)
  //     console.log('idVerticesLookup ', idVerticesLookup);

  //     // Stringify edges of each facet to compare shared edges
  //     let strEdges = []
  //     for (let i=0; i<face.facets.length; i++){
  //         let offset = 3*i;
  //         strEdges.push(strVerticesLookup[0+offset]+'-'+strVerticesLookup[1+offset]);
  //         strEdges.push(strVerticesLookup[1+offset]+'-'+strVerticesLookup[2+offset]);
  //         strEdges.push(strVerticesLookup[2+offset]+'-'+strVerticesLookup[0+offset]);
  //     }

  //     console.log('strEdges: ', strEdges)

  //     // Seperate shared and outside edges
  //     let edgesOutside = [];
  //     let edgesShared = [];
  //     for (let i=0; i<strEdges.length; i++) {

  //         let edge = strEdges[i];
  //         let edgeSplit = edge.split('-');
  //         let edgeReversed = edgeSplit[1]+'-'+edgeSplit[0];
  //         let edgeFound = null;

  //         if (edgesOutside.includes(edge)) {
  //             edgeFound = true;
  //             if (!edgesShared.includes(edge)) {
  //                 edgesShared.push(edge);
  //                 edgesShared.push(edgeReversed);
  //             }
  //         } else if (edgesOutside.includes(edgeReversed)) {
  //             edgeFound = true;
  //             if (!edgesShared.includes(edge)) {
  //                 edgesShared.push(edge);
  //                 edgesShared.push(edgeReversed);
  //             }
  //         }

  //         if (!edgeFound) {
  //             edgesOutside.push(edge);
  //         }
  //     }

  //     // Must remove first instance of shared edge
  //     // TODO: Research edge case where 3 edges are shared in boolean mesh
  //     for (let i=0; i<edgesShared.length; i++) {
  //         let edge = edgesShared[i];
  //         let edgeFoundIndex = edgesOutside.indexOf(edge);

  //         if (edgeFoundIndex != -1) {
  //             edgesOutside.splice(edgeFoundIndex, 1);
  //         }
  //     }

  //     console.log('edgesOutside ', edgesOutside)
  //     console.log('edgesShared ', edgesShared)

  //     let edgesOutsideInts = [];
  //     for (let i=0; i<edgesOutside.length; i++){
  //         let edge = edgesOutside[i].split('-');
  //         edgesOutsideInts.push([parseInt(edge[0]), parseInt(edge[1])])
  //     }

  //     let edgesSharedInts = [];
  //     for (let i=0; i<edgesShared.length; i++){
  //         let edge = edgesShared[i].split('-');
  //         edgesSharedInts.push([parseInt(edge[0]), parseInt(edge[1])])
  //     }

  //     let edgesAllInts = [];
  //     for (let i=0; i<strEdges.length; i++){
  //         let edge = strEdges[i].split('-');
  //         edgesAllInts.push([parseInt(edge[0]), parseInt(edge[1])])
  //     }

  //     // Unzip oustide edge values for sorting
  //     let edgesA = [];
  //     let edgesB = [];
  //     for (let i=0; i<edgesOutsideInts.length; i++) {
  //         let edge = edgesOutsideInts[i];
  //         edgesA.push(parseInt(edge[0]));
  //         edgesB.push(parseInt(edge[1]));
  //     }

  //     // Sort edges in chain
  //     // TODO: This will need to be updated to handle holes in face polygon
  //     let edgesSorted = [[edgesA[0], edgesB[0]]]
  //     for(let i=1; i<edgesOutside.length; i++) {
  //         let lastEdgeB = edgesSorted[i-1][1];
  //         let nextEdgeIndex = edgesA.indexOf(lastEdgeB);
  //         edgesSorted.push([edgesA[nextEdgeIndex], edgesB[nextEdgeIndex]])
  //     }

  //     console.log('edges sorted ', edgesSorted);

  //     // // Consolidate connected edges in the chain that make up larger edge
  //     // // TODO: This will need to be updated to handle holes in face polygon
  //     // let faceNormal = this.facets[face.facets[0]].normal;
  //     // let edgesConsolidated = []
  //     // edgesConsolidated.push(edgesSorted[0])

  //     // for(let i=1; i<edgesSorted.length; i++) {

  //     //     // Get vector angle of current edge
  //     //     let thisEdge = edgesSorted[i];
  //     //     let thisEdgeAVertex = this.vertices[idVerticesLookup[thisEdge[0]]];
  //     //     let thisEdgeBVertex = this.vertices[idVerticesLookup[thisEdge[1]]];
  //     //     let thisEdgeAngle = BABYLON.Vector3.GetAngleBetweenVectors(thisEdgeAVertex, thisEdgeBVertex, faceNormal);

  //     //     // Get vector angle of previous edge
  //     //     let lastEdge = edgesConsolidated[edgesConsolidated.length-1];
  //     //     let lastEdgeAVertex = this.vertices[idVerticesLookup[lastEdge[0]]];
  //     //     let lastEdgeBVertex = this.vertices[idVerticesLookup[lastEdge[1]]];
  //     //     let lastEdgeAngle = BABYLON.Vector3.GetAngleBetweenVectors(lastEdgeAVertex, lastEdgeBVertex, faceNormal);

  //     //     // Merge this edge with last if it's the same edge or add new consolidated edge
  //     //     if(thisEdgeAngle == lastEdgeAngle){
  //     //         lastEdge[1] = thisEdge[1];
  //     //     } else {
  //     //         edgesConsolidated.push(thisEdge);
  //     //     }
  //     // }

  //     // console.log('edgesConsolidated ',edgesConsolidated);

  //     // Build final vertices
  //     let edgeVertices = [];
  //     for (let i=0; i<edgesSorted.length; i++) {
  //         edgeVertices.push(this.vertices[idVerticesLookup[edgesSorted[i][0]]]);
  //     }

  //     // Build edge lines
  //     let edgeLines = [];
  //     for (let i=0; i<edgesSorted.length; i++) {
  //         let v0 = this.vertices[idVerticesLookup[edgesSorted[i][0]]];
  //         let v1 = this.vertices[idVerticesLookup[edgesSorted[i][1]]];
  //         let line = MeshBuilder.CreateLines("edge", {points: [v0, v1]}, this._scene);
  //         line.isPickable = false;
  //         line.isVisible = false;
  //         edgeLines.push(line);
  //     }

  //     //Build edges
  //     let edges = {
  //         lines: edgeLines,
  //         vertices: edgeVertices,
  //     }

  //     return edges;

  // }
}
