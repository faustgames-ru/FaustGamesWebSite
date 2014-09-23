precision mediump float;
uniform sampler2D u_Texture;
uniform sampler2D u_DepthMap;
varying vec3 v_DepthMapPosition;
varying vec2 v_TexturePosition;
varying vec4 v_Color;
varying float v_Alpha;

const float l = 256.0;
const int il = 256;

float unpackFloatFromVec4i(const vec4 value)
{
  int r = int(value.x * 255.0);
  int g = int(value.y * 255.0);
  int b = int(value.z * 255.0);
  int v = r*il*il + g*il + b;
  return float(v) / (l*l*l - 1.0);
}

void main()
{
	float z = unpackFloatFromVec4i(texture2D(u_DepthMap, v_DepthMapPosition.xy));
	float dz = clamp((v_DepthMapPosition.z - z) * 200.0, 0.0, 1.0); // todo: remove hardcode
	gl_FragColor = texture2D(u_Texture, v_TexturePosition);
	gl_FragColor.a = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) *0.333;
    gl_FragColor *= v_Color;
	gl_FragColor.w *= dz;
	gl_FragColor.w *= v_Alpha;
}
