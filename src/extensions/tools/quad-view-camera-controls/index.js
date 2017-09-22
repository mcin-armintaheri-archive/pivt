import * as THREE from 'three';
import ViewportCameraControls from './ViewportCameraControls';
import TrackballControls from './TrackballControls';

export default class QuadViewCameraControls {
  constructor(view) {
    const { layout } = view;
    const viewports = layout.getViewports();
    this.controls = viewports.slice(0, 3)
      .map(v => new ViewportCameraControls(v, layout.canvas));
    this.controls.push(new TrackballControls(viewports[3], layout.canvas));
  }
  getTrackballControls() {
    return this.controls[3];
  }
  getOrthoControls() {
    return this.controls.slice(0, 3);
  }
  dispose() {
    this.controls.forEach((control) => { control.dispose(); });
  }
  serialize() {
    const serializedControls = this.controls.map(p => ({
      pan: p.getViewport().getPan(),
      zoom: p.getViewport().getTHREECamera().zoom
    }));
    const { x, y, z } = this.controls[3].getViewport().getTHREECamera().position;
    serializedControls[3].pos = { x, y, z };
    return serializedControls;
  }
  deserialize(json) {
    json.forEach((serializedPanner, i) => {
      this.panners[i].getViewport().setPan(serializedPanner.pan);
      this.panners[i].getViewport().getTHREECamera().zoom = serializedPanner.zoom;
    });
    const { x, y, z } = json[3].pos;
    const perspCam = this.controls[3].getViewport().getTHREECamera();
    perspCam.position = new THREE.Vector3(x, y, z);
    perspCam.lookAt(new THREE.Vector3(0, 0, 0));
  }
}
