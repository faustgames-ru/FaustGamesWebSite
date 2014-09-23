precision mediump float;
varying float z;

uniform sampler2D u_DiffuseMap;
varying float lightLevel;
varying vec2 v_TexturePosition;
void main()
{
	vec4 color = texture2D(u_DiffuseMap, v_TexturePosition);
	gl_FragColor = color * lightLevel;
}