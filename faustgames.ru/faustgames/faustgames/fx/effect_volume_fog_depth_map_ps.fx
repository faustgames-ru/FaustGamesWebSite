precision highp float;

uniform sampler2D u_Texture;

varying highp float z;
varying vec2 v_TexCoordinate;

const float l = 32.0;
const int il = 32;

vec4 packFloatToVec4i(const float value)
{  
  int v = int(value * (l*l*l - 1.0));
  int r = v / (il*il);
  int g = (v - r*il*il) / il;
  int b = v - r *il*il - g * il;
  return vec4(float(r) / 255.0, float(g) / 255.0, float(b) / 255.0, 1.0);
}


const float lf = 32.0;
const int ilf = 32;

float unpackFloatFromFullVec4i(const vec4 value)
{
  int r = int(value.x * 255.0);
  int g = int(value.y * 255.0);
  int b = int(value.z * 255.0);
  int v = r*ilf*ilf + g*ilf + b;
  return float(v) / (lf*lf*lf - 1.0);
}

void main() 
{
	float zz = unpackFloatFromFullVec4i(texture2D(u_Texture, v_TexCoordinate));	
	gl_FragColor = packFloatToVec4i(min(z,zz));
	
}