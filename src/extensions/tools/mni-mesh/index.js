import * as THREE from 'three';
import { MniObjDecoder } from 'pixpipejs';
import MNIMeshSidebarWidget from './MNIMeshSidebarWidget';

function build3DMeshFromMesh3D(mesh) {
  const geometry = new THREE.BufferGeometry();
  const positions = mesh.getVertexPositions();
  const indices = mesh.getPolygonFacesOrder();
  const normals = mesh.getPolygonFacesNormals();
  const colors = mesh.getVertexColors();
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3, true));
  geometry.addAttribute('color', new THREE.BufferAttribute(colors, 4, true));
  geometry.computeBoundingSphere();
  const material = new THREE.MeshPhongMaterial({
    specular: 0xffffff,
    shininess: 250,
    side: THREE.DoubleSide,
    vertexColors: THREE.VertexColors,
    transparent: true,
    opacity: 0.9,
    clippingPlanes: [],
    clipIntersection: true
  });
  return new THREE.Mesh(geometry, material);
}

export default class MNIMesh {
  constructor(view) {
    const { scene, layout } = view;
    this.viewport = layout.getBottomRight();
    this.camDir = new THREE.Vector3();
    this.clippingPlanes = [];
    this.clipNormals = [];
    this.sidebarWidget = MNIMeshSidebarWidget;
    this.scene = scene;
    const light = new THREE.DirectionalLight();
    const cam = this.viewport.getTHREECamera();
    cam.add(light);
    this.scene.getTHREEScene().add(cam);
    this.system = this.scene.getPlaneSystem();
    this.meshes = [];
    this.shaderManager = null;
    this.showAddMeshButton = false;
  }
  addMeshFromBuffer(bufferMeta) {
    const { buffer, name, checksum } = bufferMeta;
    const decoder = new MniObjDecoder();
    return new Promise((resolve) => {
      decoder.addInput(buffer);
      decoder.update();
      const decoded = decoder.getOutput();
      const mesh = build3DMeshFromMesh3D(decoded);
      mesh.material.clippingPlanes = this.clippingPlanes;
      mesh.material.needsUpdate = true;
      this.scene.getTHREEScene().add(mesh);
      this.meshes.push({ name, checksum, mesh });
      resolve();
    });
  }
  removeMesh(index) {
    this.scene.getTHREEScene().remove(this.meshes[index].mesh);
    this.meshes.splice(index, 1);
  }
  setShaderManager(shaderManager) {
    this.shaderManager = shaderManager;
    this.onShaderReset();
    this.shaderManager.onReset(() => { this.onShaderReset(); });
  }
  onShaderReset() {
    this.showAddMeshButton = (
      this.shaderManager &&
      this.shaderManager.getMRIs().length > 0
    );
    if (!this.showAddMeshButton) {
      this.meshes.forEach((m) => { this.system.remove(m.mesh); });
      return;
    }
    this.clipNormals = this.scene.getPlanes().map((p) => {
      p.updateMatrixWorld();
      const normalMatrix = new THREE.Matrix3().getNormalMatrix(p.matrixWorld);
      return p.geometry.faces[0].normal.clone().applyMatrix3(normalMatrix).normalize();
    });
    this.clippingPlanes = this.scene.getPlanes().map((p, i) => new THREE.Plane(
      this.clipNormals[i].clone(),
      0
    ));
    /* eslint-disable no-param-reassign */
    this.meshes.forEach((m) => {
      m.mesh.material.clippingPlanes = this.clippingPlanes;
      m.mesh.material.needsUpdate = true;
    });
  }
  update() {
    this.camDir.subVectors(this.viewport.getTHREECamera().position, this.system.position);
    this.clippingPlanes.forEach((p, i) => {
      p.normal.copy(this.clipNormals[i]);
      p.normal.applyQuaternion(this.system.quaternion);
      let dot = p.normal.dot(this.camDir);
      if (dot === 0) {
        dot = -1;
      }
      p.normal.multiplyScalar(Math.sign(-dot));
      p.setFromNormalAndCoplanarPoint(p.normal, this.system.position);
    });
  }
  setShowOctants(index, value) {
    if (!this.meshes[index]) {
      return;
    }
    if (value) {
      this.meshes[index].mesh.material.clippingPlanes = [];
    } else {
      this.meshes[index].mesh.material.clippingPlanes = this.clippingPlanes;
    }
    this.meshes[index].mesh.material.needsUpdate = true;
  }
  toggleOctants(index) {
    if (!this.meshes[index]) {
      return;
    }
    if (this.meshes[index].mesh.material.clippingPlanes.length > 0) {
      this.meshes[index].mesh.material.clippingPlanes = [];
    } else {
      this.meshes[index].mesh.material.clippingPlanes = this.clippingPlanes;
    }
    this.meshes[index].mesh.material.needsUpdate = true;
  }
}
