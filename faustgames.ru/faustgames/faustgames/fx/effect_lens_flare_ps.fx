precision mediump float;
uniform sampler2D u_Texture;
uniform sampler2D u_DepthMap;
uniform vec4 u_Color;
varying vec2 v_TexturePosition;
varying vec4 v_Position;
varying vec4 v_PositionCenter;
varying float v_Blend;

void main()
{
	gl_FragColor = texture2D(u_Texture, v_TexturePosition) * u_Color;
	vec4 depthColor = texture2D (u_DepthMap, vec2(v_Position[0], v_Position[1]));
	vec4 depthColor1 = texture2D (u_DepthMap, vec2(v_PositionCenter[0], v_PositionCenter[1]));
	float depth = 1.0 - depthColor[0];
	float depth1 = 1.0 - depthColor1[0];
	//gl_FragColor *= (depth*0.1 + depth1*0.9) * v_Blend;
	gl_FragColor *= depth1 * v_Blend;
}
