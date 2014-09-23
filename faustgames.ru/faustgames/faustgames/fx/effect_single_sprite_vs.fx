precision highp float;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ModelMatrix;
attribute vec3 a_Position;
attribute vec2 a_TexturePosition;
varying vec2 v_TexCoordinate;

void main() 
{
    v_TexCoordinate = a_TexturePosition;
    gl_Position = u_ProjectionMatrix *  (u_ModelMatrix * vec4(a_Position, 1.0));
}