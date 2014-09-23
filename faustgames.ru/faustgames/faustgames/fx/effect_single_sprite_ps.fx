precision highp float;
varying vec2 v_TexCoordinate;
uniform sampler2D u_Texture;
uniform vec4 u_Color;

void main() 
{
	gl_FragColor = texture2D(u_Texture, v_TexCoordinate) * u_Color;
}