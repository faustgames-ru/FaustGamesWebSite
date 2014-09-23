precision highp float;

uniform sampler2D u_Texture;
uniform sampler2D u_Texture1;
varying vec2 v_TexCoordinate;

const float l = 32.0;
const int il = 32;

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
	float d = unpackFloatFromVec4i(texture2D(u_Texture, v_TexCoordinate));
	float d1 = unpackFloatFromVec4i(texture2D(u_Texture1, v_TexCoordinate));
	float v = clamp(d1 - d, 0.0, 1.0);
	float k = v * 5.0;//1.0 - exp(-v * 1.0);
	//gl_FragColor = texture2D(u_Texture, v_TexCoordinate)* 4.0 + vec4(d1*0.0, d*0.0, d*0.0, 0.0);
	//gl_FragColor = vec4(d1, d1, d1, 1.0) + d*0.0;
	gl_FragColor = vec4(1.0, 1.0, 1.0, k);
}