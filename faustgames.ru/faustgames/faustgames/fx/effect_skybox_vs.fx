precision highp float;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ModelMatrix;
uniform vec3 u_Eye;
uniform vec3 u_Light;

attribute vec3 a_Position;
attribute vec2 a_TexturePosition;
varying vec2 v_TexCoordinate;
varying float v_distance;
varying vec3 v_RayDirection;
varying vec3 v_SunDirection;
varying vec3 v_Eye;

void main() 
{
    v_TexCoordinate = a_TexturePosition;

	vec4 world = u_ModelMatrix * vec4(a_Position, 1.0);
	v_distance = length(world.xyz - u_Eye);
	
	v_RayDirection = world.xyz - u_Eye;
	v_SunDirection = u_Light;
	v_Eye = u_Eye;

	world = u_ViewMatrix * world;
	gl_Position = u_ProjectionMatrix * world;
}