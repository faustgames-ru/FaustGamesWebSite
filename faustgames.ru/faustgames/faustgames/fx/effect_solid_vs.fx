precision mediump float;
attribute vec3 a_Position;
attribute float a_TransformIndex;

uniform mat4 u_ModelMatrices[32];
uniform mat4 u_ProjectionMatrix;

void main()
{
	int transformIndex = int(a_TransformIndex);
    vec4 pos = u_ModelMatrices[transformIndex] * vec4(a_Position, 1.0);
    gl_Position = u_ProjectionMatrix * pos;
}