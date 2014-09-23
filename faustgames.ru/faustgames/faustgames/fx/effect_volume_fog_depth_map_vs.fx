precision highp float;

uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ModelMatrix;
uniform float u_ZNear;
uniform float u_ZFar;
attribute vec3 a_Position;
varying highp float z;
varying vec2 v_TexCoordinate;

void main() 
{
	vec4 pos = u_ModelMatrix *  vec4(a_Position, 1.0);
	pos = u_ViewMatrix * pos;
	z = clamp((pos.z - u_ZNear) / (u_ZFar - u_ZNear), 0.0, 1.0);
	pos = u_ProjectionMatrix * pos;
    gl_Position = pos;
	v_TexCoordinate = vec2(pos.x / pos.w, pos.y / pos.w);
	//v_TexCoordinate *= 0.5;
	//v_TexCoordinate += 0.5;
}