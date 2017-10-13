import * as THREE from 'three';

const vertexShader = `
  precision highp float;

  varying  vec2 vUv;
  varying  vec4 worldCoord;

  void main( void )
  {
    vUv = uv * 2.0 - vec2(1.0, 1.0);
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    worldCoord = modelMatrix * vec4( position, 1.0 );
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float thickness;
  uniform bool active;

  varying vec2 vUv;

  void main(void) {
    if (active && (abs(vUv.x) > 1.0 - thickness || abs(vUv.y) > 1.0 - thickness)) {
      gl_FragColor = vec4(0.0, 0.9, 0.0, 1.0);
      return;
    }
    discard;
  }
`;

class ViewportIndicator {
  constructor(viewportController) {
    this.controls = viewportController;
    const geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        thickness: { value: 0.012 },
        active: { value: false }
      }
    });
    this.screenPlane = new THREE.Mesh(geometry, this.material);
    this.screenScene = viewportController.getViewport().getScreenScene();
    this.screenScene.getTHREEScene().add(this.screenPlane);
  }
  getControls() {
    return this.controls;
  }
  setActive(boolean) {
    this.material.uniforms.active.value = boolean;
  }
}

export default class ActiveViewportIndicator {
  constructor() {
    this.indicators = [];
  }
  switchActiveViewportControls(controls) {
    const activeIndicator = this.indicators.find(i => i.getControls() === controls);
    this.indicators.forEach((i) => { i.setActive(false); });
    if (activeIndicator !== undefined) {
      activeIndicator.setActive(true);
      return;
    }
    const newIndicator = new ViewportIndicator(controls);
    newIndicator.setActive(true);
    this.indicators.push(newIndicator);
  }
}
