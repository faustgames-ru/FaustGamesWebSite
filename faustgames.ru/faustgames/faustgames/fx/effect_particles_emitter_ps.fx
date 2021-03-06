precision mediump float;
uniform sampler2D u_Texture;
varying vec2 v_TexturePosition;
varying vec4 v_Color;

void main()
{
	gl_FragColor = texture2D(u_Texture, v_TexturePosition);
	gl_FragColor.a = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) *0.333;
    gl_FragColor *= v_Color;
}
