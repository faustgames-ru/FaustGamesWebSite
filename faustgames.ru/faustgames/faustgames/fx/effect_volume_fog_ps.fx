precision highp float;
uniform sampler2D u_Texture;
varying vec2 v_TexCoordinate;
varying vec4 v_VertexColor;

float unpackFloatFromVec4i(const vec4 value)
{
	const vec4 bitSh = vec4(1.0 / (256.0 * 256.0 * 256.0), 1.0 / (256.0 * 256.0), 1.0 / 256.0, 1.0);
	return(dot(value, bitSh));
}

void main() 
{
  vec4 depth = texture2D(u_Texture, v_TexCoordinate);
	float d = unpackFloatFromVec4i(depth);
	if (d > 0.9)
	{
		gl_FragColor = vec4(1, 1, 1, 0.0);
	}
	else
	{
		float z = clamp(gl_FragCoord.w / gl_FragCoord.z, 0.0, 1.0);
		float v = (z - d) *8.0;
		gl_FragColor = vec4(1, 1, 1, v) * v_VertexColor;
	}
}
