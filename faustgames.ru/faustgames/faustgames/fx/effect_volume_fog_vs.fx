precision highp float;
uniform mat4 u_ProjectionMatrix;
attribute vec3 a_Position;
attribute vec4 a_Color;
varying vec2 v_TexCoordinate;
varying vec4 v_VertexColor;

void main() 
{
	v_VertexColor = a_Color;
	vec4 res =u_ProjectionMatrix *  vec4(a_Position, 1.0);
    gl_Position = res;
	v_TexCoordinate = (vec2(res[0] / res[3], res[1] / res[3])  + 1.0) * 0.5;
}