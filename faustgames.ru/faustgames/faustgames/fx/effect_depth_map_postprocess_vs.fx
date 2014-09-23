precision highp float;
attribute vec3 a_Position;
attribute vec2 a_TexturePosition;
varying vec2 v_TexCoordinate;

void main() 
{
    v_TexCoordinate = a_TexturePosition;
    gl_Position = vec4(a_Position, 1.0);
}