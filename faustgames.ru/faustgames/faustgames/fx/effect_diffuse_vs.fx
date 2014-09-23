precision mediump float;
attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute vec2 a_TexturePosition;
attribute float a_TransformIndex;

uniform mat4 u_ModelMatrices[32];
uniform mat3 u_NormalMatrices[32];
uniform mat4 u_ProjectionMatrix;
uniform vec3 u_Light;

varying float lightLevel;
varying vec2 v_TexturePosition;

void main()
{
	int transformIndex = int(a_TransformIndex);
    vec4 pos = u_ModelMatrices[transformIndex] * vec4(a_Position, 1.0);
	vec3 lightDirection = normalize(u_Light - pos.xyz);
	lightLevel = dot(lightDirection, normalize(u_NormalMatrices[transformIndex] * a_Normal));
	v_TexturePosition = a_TexturePosition;
    gl_Position = u_ProjectionMatrix * pos;
}