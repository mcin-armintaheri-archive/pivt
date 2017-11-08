export const VERTEX = `
  precision highp float;

  varying vec4 worldCoord;

  void main( void )
  {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
    worldCoord = modelMatrix * vec4( position, 1.0 );
  }
`;

export const FRAGMENT = (nbTextures, numMRIs) => `
  precision highp float;

  // time index
  uniform float timeIndex;

  // Use trinlinear interpolation
  uniform bool trilinearInterpolation;

  // texture that represent the curve data to look up
  uniform sampler2D contrastTexture;

  // enable contrast curve
  uniform bool enableConstrast;

  // brightness factor of the voxels
  uniform float brightness;

  // voxel -> world and world -> voxel transforms
  uniform vec3 worldMin;
  uniform vec3 worldMax;
  uniform mat4 w2v[${numMRIs}];
  uniform mat3 swapMat[${numMRIs}];
  uniform vec3 stride[${numMRIs}];
  uniform vec3 dimensions[${numMRIs}];
  // sampling weights
  uniform float weight[${numMRIs}];

  // number of textures used, and texture array offset of the volumes
  uniform int nbTexturesUsed[${numMRIs}];
  uniform int textureOffsets[${numMRIs}];

  // buffer sizes and textures array containing all the volumetric data.
  uniform vec2 textureSize[${nbTextures}];
  uniform sampler2D textures[${nbTextures}];

  // color map textures
  uniform sampler2D colorMap[${numMRIs}];

  // enable color maps
  uniform int enableColorMap[${numMRIs}];

  // interpolated fragment values
  varying vec4 worldCoord;

  bool outOfBounds(vec3 pos, vec3 minCoord, vec3 maxCoord)
  {
    return (
      (pos.x <= minCoord.x) || (pos.x >= maxCoord.x) ||
      (pos.y <= minCoord.y) || (pos.y >= maxCoord.y) ||
      (pos.z <= minCoord.z) || (pos.z >= maxCoord.z)
    );
  }

  float getIntensityWorldNearest(
    vec3 voxelPos,
    float timeIndex,
    vec3 dimensions,
    vec3 stride,
    int textureOffset,
    int nbTexturesUsed
  )
  {

    float skipped = 0.0;
    for (int i = 0; i < ${nbTextures}; i++)
    {
      if (i >= textureOffset && i < textureOffset + nbTexturesUsed)
      {
        float bufferSize = floor(textureSize[i].x * textureSize[i].y);
        if (outOfBounds(voxelPos, vec3(0.0, 0.0, 0.0), dimensions))
        {
          skipped += bufferSize;
          continue;
        }
        float offset = floor(dot(voxelPos, stride));
        offset -= skipped;
        vec2 tex;
        tex.x = mod(offset, textureSize[i].x) + 0.5;
        tex.y = floor(offset / textureSize[i].x) + 0.5;
        tex = tex / textureSize[i];
        vec4 color = texture2D(textures[i], tex);
        return color.r;
      }
    }
    return -1.0;
  }
  const float EPSILON = 0.06;
  // return the color corresponding to the given shifted world cooridinates
  // using a neirest neighbors approx (no interpolation)
  void getIntensityWorld(inout vec4 colors[${numMRIs}], vec4 worldCoord, float timeIndex)
  {
    float maxIntensity = -1.0;
    for (int i = 0; i < ${numMRIs}; i++)
    {
      // vec3 voxelPos =  (w2v[i] * worldCoord).xyz * swapMat[i];
      vec3 voxelPos = swapMat[i] * (w2v[i] * worldCoord).xyz;
      voxelPos = floor(voxelPos);
      float intensity = getIntensityWorldNearest(
        voxelPos,
        timeIndex,
        dimensions[i],
        stride[i],
        textureOffsets[i],
        nbTexturesUsed[i]
      );
      if (intensity > maxIntensity) {
        maxIntensity = intensity;
      }
      if (enableConstrast)
      {
        intensity = texture2D(contrastTexture, vec2(intensity, 0.5)).r;
      }
      if (enableColorMap[i] == 1 && intensity >= EPSILON)
      {
        colors[i].rgb = texture2D(colorMap[i], vec2(intensity, 0.5)).rgb;
        colors[i].a = 1.0;
      } else {
        colors[i] = vec4(intensity, intensity, intensity, 1.0);
      }
      if (brightness >= 0.0)
      {
        colors[i].rgb = clamp(colors[i].rgb * brightness, 0.0, 1.0);
      }
      colors[i] *= weight[i];
    }
    if (maxIntensity < 0.0) {
      discard;
    }
  }

  /*
  float getIntensityWorldTrilinear(float intensities[${numMRIs}], vec3 voxel, float timeIndex)
  {
    // For the sake of readability, let's assume that:
    float xBottom = floor(voxel.x + 0.05);
    float yBottom = floor(voxel.y + 0.05);
    float zBottom = floor(voxel.z + 0.05);
    float xTop = floor(xBottom + 1.05);
    float yTop = floor(yBottom + 1.05);
    float zTop = floor(zBottom + 1.05);
    // making a normalized space out of our coordinates
    float xNorm = voxel.x - xBottom;
    float yNorm = voxel.y - yBottom;
    float zNorm = voxel.z - zBottom;
    // fetching the colors at each corner
    float V000 = getIntensityWorldNearest(intensities, vec3(xBottom, yBottom, zBottom), timeIndex);
    float V100 = getIntensityWorldNearest(intensities, vec3(xTop, yBottom, zBottom), timeIndex);
    float V010 = getIntensityWorldNearest(intensities, vec3(xBottom, yTop, zBottom), timeIndex);
    float V001 = getIntensityWorldNearest(intensities, vec3(xBottom, yBottom, zTop), timeIndex);
    float V101 = getIntensityWorldNearest(intensities, vec3(xTop, yBottom, zTop), timeIndex);
    float V011 = getIntensityWorldNearest(intensities, vec3(xBottom, yTop, zTop), timeIndex);
    float V110 = getIntensityWorldNearest(intensities, vec3(xTop, yTop, zBottom), timeIndex);
    float V111 = getIntensityWorldNearest(intensities, vec3(xTop, yTop, zTop), timeIndex);
    float interpVal = V000 * (1. - xNorm) * (1. - yNorm) * (1. - zNorm) +
                     V100 * xNorm * (1. - yNorm) * (1. - zNorm) +
                     V010 * (1. - xNorm) * yNorm * (1. - zNorm) +
                     V001 * (1. - xNorm) * (1. - yNorm) * zNorm +
                     V101 * xNorm * (1. - yNorm) * zNorm +
                     V011 * (1. - xNorm) * yNorm * zNorm +
                     V110 * xNorm * yNorm * (1. - zNorm) +
                     V111 * xNorm * yNorm * zNorm;
    return interpVal;
  }
  */


  void main( void )
  {
    if (outOfBounds(worldCoord.xyz, worldMin, worldMax))
    {
      discard;
      return;
    }

    // interpolation or not
    vec4 colors[${numMRIs}];
    getIntensityWorld(colors, worldCoord, timeIndex);

    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    for (int i = 0; i < ${numMRIs}; i++)
    {
      gl_FragColor += colors[i];
    }
    gl_FragColor  = clamp(gl_FragColor, 0.0, 1.0);
  }
`;
