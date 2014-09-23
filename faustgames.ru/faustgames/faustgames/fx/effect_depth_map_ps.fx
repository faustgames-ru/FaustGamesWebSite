precision highp float;

varying float z;

const float l = 256.0;
const int il = 256;

vec4 packFloatToVec4i(const float value)
{  
	int v = int(value * (l*l*l - 1.0));
	int r = v / (il*il);
	int g = (v - r*il*il) / il;
	int b = v - r *il*il - g * il;
	return vec4(float(r) / 255.0, float(g) / 255.0, float(b) / 255.0, 1.0);
}

void main() 
{
	gl_FragColor = packFloatToVec4i(z);
}