class SelectorManager {

    constructor(scene) {
        this._scene = scene;
        this._attachedMesh = null;
        this._attachedMeshGeometry = null;
        this._ignoredMeshes = [];
        this._selectorsEnabled = { grabSelector: true, faceSelector: false}
        this.selectors = { grabSelector: null, faceSelector: null};

        const modeSelectKeyboardObserver = this._modeSelectKeyboardObserver(this._scene);
        const attachToMeshPointerObserver = this._attachToMeshPointerObserver(this._scene);
        this._observers = [modeSelectKeyboardObserver, attachToMeshPointerObserver];
    }

    _modeSelectKeyboardObserver = (scene) => {
        const keyboardObserver = scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type == BABYLON.KeyboardEventTypes.KEYDOWN) {

                // Enabled/Disable faceSelector keys
                if (kbInfo.event.key == 'f'){
                    this.setFaceSelectorEnabled(true);
                } else {
                    this.setFaceSelectorEnabled(false);
                }

                // Enabled/Disable grabSelector keys
                if (kbInfo.event.key == 'g'){
                    this.setGrabSelectorEnabled(true);
                } else {
                    this.setGrabSelectorEnabled(false);
                }
            }

        });
        return keyboardObserver;
    }

    _attachToMeshPointerObserver = (scene) => {
        const pointerObserver = scene.onPointerObservable.add((pointerInfo) => {

            if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERDOWN) {
                if (pointerInfo.pickInfo && pointerInfo.pickInfo.pickedMesh) {

                    let node = pointerInfo.pickInfo.pickedMesh;
                    if (!this._ignoredMeshes.includes(node)) {
                        if (node instanceof BABYLON.AbstractMesh) {
                            if (this._attachedMesh != node) {
                                this.attachToMesh(node);
                            }
                        } else {
                            this.attachToMesh(null)
                        }
                    } else {
                        this.attachToMesh(null);
                    }
                } else {
                    this.attachToMesh(null);
                }
            }

        });

        return pointerObserver;
    }

    attachToMesh = (mesh) => {
        console.log('attachToMesh called..')
        // Remove all objects from previous mesh
        if (this._attachedMesh) {
            this._attachedMeshGeometry.dispose();
            this._attachedMeshGeometry = null;
        }

        // Attach new mesh
        this._attachedMesh = mesh;
        if (this._attachedMesh) {
            this._attachedMeshGeometry = new MeshGeometry(mesh);
        }

        // Attach selectors
        for (let key in this.selectors) {
            let selector = this.selectors[key];
            console.log(selector)
            if(selector && this._selectorsEnabled[key]){
                console.log('attaching selector: ', selector)
                selector.attachMesh(this._attachedMesh, this._attachedMeshGeometry)
            }
        }

    }

    setIgnoredMeshes = (meshes) => {
        this._ignoredMeshes.push(meshes);
    }

    setFaceSelectorEnabled = (value) => {
        if (value) {
            if (!this.selectors.faceSelector) {
                this.selectors.faceSelector = new FaceSelector(this._scene, BABYLON.Color3(1, 0.85, 0));
            }
            if (this._attachedMesh) {
                this._attachedMeshGeometry.dispose()
                this._attachedMeshGeometry = new MeshGeometry(this._attachedMesh);
                this.selectors.faceSelector.attachMesh(this._attachedMesh, this._attachedMeshGeometry);
            }
        } else {
            if (this.selectors.faceSelector) {
                this.selectors.faceSelector.dispose();
                this.selectors.faceSelector.attachMesh(null, null);
            }
        }
        this._selectorsEnabled.faceSelector = value;
    }

    setGrabSelectorEnabled = (value) => {
        if (value) {
            if (!this.selectors.grabSelector) {
                this.selectors.grabSelector = new GrabSelector(this._scene);
            }
            if (this._attachedMesh) {
                this.selectors.grabSelector.attachMesh(this._attachedMesh);
            }
        } else {
            if (this.selectors.grabSelector) {
                this.selectors.grabSelector.dispose();
            }
        }
        this._selectorsEnabled.grabSelector = value;

    }
}

class FaceSelector {
    constructor (scene, color) {
        this._scene = scene;
        this._attachedMesh = null;
        this._attachedMeshGeometry = null;

        this.selectedFacet = null;
        this.selectedFace = null;
        this.selectedFaceEdges = null;

        // TODO: this is not the place to put this
        this.selectorAssets = new SelectorAssets(this._scene);

        var color = new BABYLON.Color3(1, 1, 1);

        this.selectMaterial = new BABYLON.StandardMaterial("selectMaterial", scene);
        this.selectMaterial.diffuseColor = color;
        this.selectMaterial.specularColor = color;
        this.selectMaterial.emissiveColor = color;
        this.selectMaterial.alpha = .5;

        this._pointerObserver = this._scene.onPointerObservable.add((pointerInfo) => {
            if (pointerInfo.type == BABYLON.PointerEventTypes.POINTERMOVE) {

                if (!this._attachedMesh) {
                    return;
                }

                let pickInfo = this._scene.pick(this._scene.pointerX, this._scene.pointerY);

                // If we are not hoving over active mesh, return
                if(!pickInfo.pickedMesh || pickInfo.pickedMesh.name !== this._attachedMesh.name){
                    if (this.selectedFace) {
                        this.selectedFace.mesh.isVisible = false;
                        let lines = this.selectedFaceEdges.lines;
                            for(let i=0; i<lines.length; i++){
                                lines[i].dispose();
                            }
                    }
                    this.selectedFacet = null;
                    this.selectedFace = null;
                    return;
                }

                // Check if we're hovering over a different facet than before
                let facetId = pickInfo.faceId
                if(this.selectedFacet !== facetId){

                    // Set new facet to active
                    this.selectedFacet = facetId

                    // Check if we're hoving over a new face
                    let face = this._attachedMeshGeometry.getFace(facetId)
                    if (this.selectedFace !== face.id){

                        // Hide current face group if we're transitioning to a new face
                        if(this.selectedFace !== null){
                            this.selectedFace.mesh.isVisible = false
                            let lines = this.selectedFaceEdges.lines;
                            for(let i=0; i<lines.length; i++){
                                lines[i].dispose();
                            }

                        }

                        // Set new face group to active
                        this.selectedFace = face;
                        this.selectedFaceEdges = this._attachedMeshGeometry.getEdges(facetId)

                        //this.selectedFace.mesh.material.diffuseColor = BABYLON.Color3(1, 0.85, 0);
                        this.selectedFace.mesh.material = this.selectMaterial;
                        this.selectedFace.mesh.isVisible = true;

                        let lines = this.selectedFaceEdges.lines;
                        console.log('lines: ', lines);
                        for(let i=0; i<lines.length; i++){
                            //this.selectorAssets.CreateEdgeMidpointSelector(lines[i]);
                            lines[i].isVisible = true;
                        }
                    }
                }
            }
        });
    }

    attachMesh = (mesh, geometry) => {
        this._attachedMesh = mesh;
        this._attachedMeshGeometry = geometry;
    }

    dispose = () => {
        if (this.selectedFace) {
            this.selectedFace.mesh.isVisible = false;
            let lines = this.selectedFaceEdges.lines;
            for(let i=0; i<lines.length; i++){
                lines[i].isVisible = false;
            }
        }
        this.selectedFacet = null;
        this.selectedFace = null;
    }

}

class GrabSelector {
    constructor (scene) {
        this._scene = scene;
        this._attachedMesh = null;
        this._grabBehavior = new BABYLON.PointerDragBehavior();
    }

    attachMesh = (mesh) => {
        if (this._attachedMesh) {
            this._attachedMesh.removeBehavior(this._grabBehavior)
        }

        this._attachedMesh = mesh

        if (this._attachedMesh) {
            this._attachedMesh.addBehavior(this._grabBehavior);
            console.log('attaching grab to mesh: ', this._attachedMesh)
        }

    }

    dispose = () => {
        if (this._attachedMesh) {
            this._attachedMesh.removeBehavior(this._grabBehavior)
        }
        this._attachedMesh = null;
    }
}

class SelectorAssets {
    constructor (scene) {
        this._scene = scene;
        this.assets = [];
    }

    CreateEdgeMidpointSelector = (line) => {
        let positions = line.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        let v0 = new BABYLON.Vector3.FromArray([positions[0], positions[1], positions[2]]);
        let v1 = new BABYLON.Vector3.FromArray([positions[3], positions[4], positions[5]]);
        let center = BABYLON.Vector3.Center(v0, v1);
        let marker = BABYLON.MeshBuilder.CreateBox("box", {size: .1}, scene);
        marker.position = center;
        this.assets.push(marker);
    }

    dispose = () => {
        // Dispose all mesh assets
        for (let i=0; i<this.assets.length; i++) {
            this.assets[i].dispose();
        }
    }


}

class MeshGeometry {
    constructor (mesh) {
        this._mesh = mesh;
        this._scene = mesh.getScene();
        this.vertices = this.buildVertices();
        this.facets = this.buildFacets();
        this.faces = this.buildFaces();
    }

    dispose = () => {
        // Remove all face meshes from scene
        for(let i=0; i<this.faces.length; i++){
            let face = this.faces[i];
            if (face.mesh) {
                face.mesh.dispose();
            }
        }
    }

    buildVertices= () => {
        let indices = this._mesh.getIndices();
        let positions = this._mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);


        // Pack vertices into Vector3
        let vertices = [];
        for(let i=0; i<indices.length; i++){
            let localVertex = BABYLON.Vector3.FromArray(positions, 3 * indices[i]);
            let globalVertex = BABYLON.Vector3.TransformCoordinates(localVertex, this._mesh.getWorldMatrix());
            vertices.push(globalVertex);
        }
        return vertices;
    }

    buildFacets = () => {
        let facets = [];
        let numFacets = this.vertices.length/3

        // Group vertices by faceID and get normal
        for(let i = 0; i<numFacets; i++){
            let offset = i * 3;
            let verticesLookup = [0 + offset, 1 + offset, 2 + offset];

            // Calculate facet normal // taken from core/convertToFlatShadedMesh()
            const p1 = this.vertices[verticesLookup[0]];
            const p2 = this.vertices[verticesLookup[1]];
            const p3 = this.vertices[verticesLookup[2]];

            const p1p2 = p1.subtract(p2);
            const p3p2 = p3.subtract(p2);

            const normal = BABYLON.Vector3.Normalize(BABYLON.Vector3.Cross(p1p2, p3p2));

            // Push facet vertices lookup and  normal
            let facet = {
                vertices: verticesLookup,
                normal: normal,
                face: null,
            }
            facets.push(facet);
        }

        return facets;
    }

    buildFaces = () => {
        let faces = [];
        let numFacets = this.vertices.length/3;
        let lastFacet = numFacets-1;

        let face = {
            id: null,
            facets: [],
            edges: [],
            mesh: null,
        };
        let thisFaceId = 0;
        let nextFaceId = 0;
        const epsilon = Math.pow(10, -6);

        // Construct face data
        for(let i=0; i<numFacets; i++){

            // Add this facet to this face group
            face.facets.push(i);

            // Add face lookup to this facet
            this.facets[i].face = thisFaceId;

            // Check to advance next face id if facet does not have similar normal
            if(i !== lastFacet){
                if(!this.facets[i].normal.equalsWithEpsilon(this.facets[i+1].normal, epsilon)){
                    // Store face normal and advance nextFaceID
                    nextFaceId ++;
                }
            }

            // Build face group mesh if next facet has different normal
            // signifying new face group or we're at the last facet
            if(thisFaceId !== nextFaceId|| i == lastFacet){

                // Add ID and normal to face
                face.id = thisFaceId;
                face.normal = this.facets[i].normal;

                // Add face to faces
                faces.push(face);
                thisFaceId ++;

                // Reset face
                face = {
                    id: null,
                    facets: [],
                    edges: [],
                    normal: null,
                    mesh: null,
                };
            }
        }

        return faces;
    }

    getFace = (facetId) => {
        // Get face from facet id
        let face = this.faces[this.facets[facetId].face];

        if (!face.mesh){
            // Create mesh for face
            face.mesh = new BABYLON.Mesh("face", this._scene);
            face.mesh.isPickable = false;
            face.mesh.isVisible = false;

            // Prepare to unpack indices and positions from face group
            let indices = []
            let positions = []
            let index = 0

            // Loop through facets
            for(let i=0; i<face.facets.length; i++){

                // Get this facet
                let facet = this.facets[face.facets[i]]

                // Loop through facet vertices
                for(let j=0; j<facet.vertices.length; j++){

                    // Append indices to custom mesh
                    indices.push(index)
                    index++

                    // Get this vertex from lookup
                    let vertex = this.vertices[facet.vertices[j]];

                    // Append positions to custom mesh
                    positions.push(vertex.x)
                    positions.push(vertex.y)
                    positions.push(vertex.z)
                }
            }

            // Add vertex data to face mesh
            let data = new BABYLON.VertexData();
            data.positions = positions;
            data.indices = indices;
            data.applyToMesh(face.mesh);
        }
        return face;
    }

    getEdges = (facetId) => {

        // Get face from facetId
        let face = this.faces[this.facets[facetId].face];

        // Stringify vertices of this face to compare shared vertices
        let strVertices = [];
        let strVerticesLookup = [];
        let idVerticesLookup = [];

        // Loop through facets from this face
        for (let i=0; i<face.facets.length; i++){
            let facet = this.facets[face.facets[i]];

            // Loop through vertices of each facet
            for (let k=0; k<facet.vertices.length; k++) {
                let v = this.vertices[facet.vertices[k]]

                // Stringify vertex for indexof lookup
                let strV = v.x + ', ' + v.y + ', ' + v.z;
                let strVIndex = strVertices.indexOf(strV);

                // Store strV if this is its first occurance and save vertex id
                if (strVIndex == -1) {
                    strVertices.push(strV);
                    strVIndex = strVertices.length - 1;
                    idVerticesLookup.push(facet.vertices[k]);

                }

                strVerticesLookup.push(strVIndex);

            }

        }

        console.log('strVerticesLookup ',strVerticesLookup)
        console.log('idVerticesLookup ', idVerticesLookup);

        // Stringify edges of each facet to compare shared edges
        let strEdges = []
        for (let i=0; i<face.facets.length; i++){
            let offset = 3*i;
            strEdges.push(strVerticesLookup[0+offset]+'-'+strVerticesLookup[1+offset]);
            strEdges.push(strVerticesLookup[1+offset]+'-'+strVerticesLookup[2+offset]);
            strEdges.push(strVerticesLookup[2+offset]+'-'+strVerticesLookup[0+offset]);
        }

        console.log('strEdges: ', strEdges)

        // Seperate shared and outside edges
        let edgesOutside = [];
        let edgesShared = [];
        for (let i=0; i<strEdges.length; i++) {

            let edge = strEdges[i];
            let edgeSplit = edge.split('-');
            let edgeReversed = edgeSplit[1]+'-'+edgeSplit[0];
            let edgeFound = null;

            if (edgesOutside.includes(edge)) {
                edgeFound = true;
                if (!edgesShared.includes(edge)) {
                    edgesShared.push(edge);
                    edgesShared.push(edgeReversed);
                }
            } else if (edgesOutside.includes(edgeReversed)) {
                edgeFound = true;
                if (!edgesShared.includes(edge)) {
                    edgesShared.push(edge);
                    edgesShared.push(edgeReversed);
                }
            }

            if (!edgeFound) {
                edgesOutside.push(edge);
            }
        }

        // Must remove first instance of shared edge
        // TODO: Research edge case where 3 edges are shared in boolean mesh
        for (let i=0; i<edgesShared.length; i++) {
            let edge = edgesShared[i];
            let edgeFoundIndex = edgesOutside.indexOf(edge);

            if (edgeFoundIndex != -1) {
                edgesOutside.splice(edgeFoundIndex, 1);
            }
        }

        console.log('edgesOutside ', edgesOutside)
        console.log('edgesShared ', edgesShared)

        let edgesOutsideInts = [];
        for (let i=0; i<edgesOutside.length; i++){
            let edge = edgesOutside[i].split('-');
            edgesOutsideInts.push([parseInt(edge[0]), parseInt(edge[1])])
        }

        let edgesSharedInts = [];
        for (let i=0; i<edgesShared.length; i++){
            let edge = edgesShared[i].split('-');
            edgesSharedInts.push([parseInt(edge[0]), parseInt(edge[1])])
        }

        let edgesAllInts = [];
        for (let i=0; i<strEdges.length; i++){
            let edge = strEdges[i].split('-');
            edgesAllInts.push([parseInt(edge[0]), parseInt(edge[1])])
        }

        // Unzip oustide edge values for sorting
        let edgesA = [];
        let edgesB = [];
        for (let i=0; i<edgesOutsideInts.length; i++) {
            let edge = edgesOutsideInts[i];
            edgesA.push(parseInt(edge[0]));
            edgesB.push(parseInt(edge[1]));
        }

        // Sort edges in chain
        // TODO: This will need to be updated to handle holes in face polygon
        let edgesSorted = [[edgesA[0], edgesB[0]]]
        for(let i=1; i<edgesOutside.length; i++) {
            let lastEdgeB = edgesSorted[i-1][1];
            let nextEdgeIndex = edgesA.indexOf(lastEdgeB);
            edgesSorted.push([edgesA[nextEdgeIndex], edgesB[nextEdgeIndex]])
        }

        console.log('edges sorted ', edgesSorted);


        // // Consolidate connected edges in the chain that make up larger edge
        // // TODO: This will need to be updated to handle holes in face polygon
        // let faceNormal = this.facets[face.facets[0]].normal;
        // let edgesConsolidated = []
        // edgesConsolidated.push(edgesSorted[0])

        // for(let i=1; i<edgesSorted.length; i++) {

        //     // Get vector angle of current edge
        //     let thisEdge = edgesSorted[i];
        //     let thisEdgeAVertex = this.vertices[idVerticesLookup[thisEdge[0]]];
        //     let thisEdgeBVertex = this.vertices[idVerticesLookup[thisEdge[1]]];
        //     let thisEdgeAngle = BABYLON.Vector3.GetAngleBetweenVectors(thisEdgeAVertex, thisEdgeBVertex, faceNormal);

        //     // Get vector angle of previous edge
        //     let lastEdge = edgesConsolidated[edgesConsolidated.length-1];
        //     let lastEdgeAVertex = this.vertices[idVerticesLookup[lastEdge[0]]];
        //     let lastEdgeBVertex = this.vertices[idVerticesLookup[lastEdge[1]]];
        //     let lastEdgeAngle = BABYLON.Vector3.GetAngleBetweenVectors(lastEdgeAVertex, lastEdgeBVertex, faceNormal);

        //     // Merge this edge with last if it's the same edge or add new consolidated edge
        //     if(thisEdgeAngle == lastEdgeAngle){
        //         lastEdge[1] = thisEdge[1];
        //     } else {
        //         edgesConsolidated.push(thisEdge);
        //     }
        // }

        // console.log('edgesConsolidated ',edgesConsolidated);

        // Build final vertices
        let edgeVertices = [];
        for (let i=0; i<edgesSorted.length; i++) {
            edgeVertices.push(this.vertices[idVerticesLookup[edgesSorted[i][0]]]);
        }

        // Build edge lines
        let edgeLines = [];
        for (let i=0; i<edgesSorted.length; i++) {
            let v0 = this.vertices[idVerticesLookup[edgesSorted[i][0]]];
            let v1 = this.vertices[idVerticesLookup[edgesSorted[i][1]]];
            let line = BABYLON.MeshBuilder.CreateLines("edge", {points: [v0, v1]}, this._scene);
            line.isPickable = false;
            line.isVisible = false;
            edgeLines.push(line);
        }

        //Build edges
        let edges = {
            lines: edgeLines,
            vertices: edgeVertices,
        }

        return edges;

    }

}



var createScene = function () {
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates the camera
    var camera = new BABYLON.ArcRotateCamera("camera", BABYLON.Tools.ToRadians(90), BABYLON.Tools.ToRadians(70), 5, BABYLON.Vector3.Zero(), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'box' shape.
    //var box = BABYLON.MeshBuilder.CreateBox('box', {size:2}, scene)
    var box = BABYLON.MeshBuilder.CreatePolyhedron("box", {type:2}, scene);
    //var box = BABYLON.MeshBuilder.CreateSphere("box", {diameter: 2}, scene);
    // Move the box upward 1/2 its height
    box.position.y += 1;
    box.rotation.y += Math.PI/5

    var color = new BABYLON.Color3(1, 1, 1);
    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseColor = color;
    mat.specularColor = color;

    box.material = mat;

    // Our built-in 'ground' shape.
    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6, height: 6}, scene);

    var selectorManager = new SelectorManager(scene);
    selectorManager.setIgnoredMeshes(ground);


    // var a = BABYLON.MeshBuilder.CreateBox('box', {size:1}, scene)
    // var b = BABYLON.MeshBuilder.CreateBox('box', {size:1}, scene)

    // a.position.y += 1;
    // b.position.y += 1.5;
    // b.rotation.y += Math.PI/8;

    // var aCSG = BABYLON.CSG.FromMesh(a);
    // var bCSG = BABYLON.CSG.FromMesh(b);

    // var subCSG = aCSG.subtract(bCSG);

    // // // Disposing original meshes since we don't want to see them on the scene
    // a.dispose();
    // b.dispose();

    // subCSG.toMesh("csg", new BABYLON.StandardMaterial("mat", scene), scene);

    return scene;

};