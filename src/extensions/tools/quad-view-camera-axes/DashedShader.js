export const VERTEX = `
  precision highp float;
  varying  vec3 modelCoord;

  void main( void )
  {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    modelCoord = position.xyz;
  }
`;

export const FRAGMENT = `
  precision highp float;

  uniform float r;
  uniform float g;
  uniform float b;
  uniform float opacity;
  uniform float dashLength;

  varying vec3 modelCoord;

  bool evenBoxCheck( vec3 point )
  {
    return floor(mod(abs(point.x)/dashLength, 2.0)) == 0.0 &&
           floor(mod(abs(point.y)/dashLength, 2.0)) == 0.0 &&
           floor(mod(abs(point.z)/dashLength, 2.0)) == 0.0;
  }

  void main( void )
  {
    if (modelCoord.x + modelCoord.y + modelCoord.z >= 0.0)
    {
      gl_FragColor = vec4(r, g, b, opacity);
      return;
    }
    if (evenBoxCheck(modelCoord))
    {
      gl_FragColor = vec4(r, g, b, opacity);
      return;
    }
    discard;
  }
`;
