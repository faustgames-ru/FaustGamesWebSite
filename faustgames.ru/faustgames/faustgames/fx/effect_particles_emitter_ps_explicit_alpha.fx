precision mediump float;
uniform sampler2D u_Texture;
varying vec2 v_TexturePosition;
varying vec4 v_Color;

void main()
{
	gl_FragColor = texture2D(u_Texture, v_TexturePosition);
	gl_FragColor.a *= (v_Color.r + v_Color.g + v_Color.b) *0.333;
}
