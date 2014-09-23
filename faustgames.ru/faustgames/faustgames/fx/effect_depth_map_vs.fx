precision mediump float;
attribute vec3 a_Position;
attribute float a_TransformIndex;

uniform mat4 u_ModelMatrices[32];
uniform mat4 u_ViewMatrix;
uniform mat4 u_ProjectionMatrix;
uniform float u_ZNear;
uniform float u_ZFar;

varying float z;

void main()
{
	int transformIndex = int(a_TransformIndex);
    vec4 pos = u_ModelMatrices[transformIndex] * vec4(a_Position, 1.0);
	pos = u_ViewMatrix * pos;
	z = 1.0 - clamp((pos.z - u_ZNear) / (u_ZFar - u_ZNear), 0.0, 1.0);
    gl_Position = u_ProjectionMatrix * pos;

}