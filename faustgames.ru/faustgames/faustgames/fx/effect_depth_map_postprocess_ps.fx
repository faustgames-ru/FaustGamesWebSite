precision highp float;

uniform sampler2D u_Texture;
varying vec2 v_TexCoordinate;

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
	float z = unpackFloatFromVec4i(texture2D(u_Texture, v_TexCoordinate));
	gl_FragColor = vec4(z, z, z, 1.0);
}