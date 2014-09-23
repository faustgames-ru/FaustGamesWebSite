precision mediump float;

attribute vec3 a_MidPoint;
attribute vec3 a_Position;
attribute vec2 a_TexturePosition;
attribute vec4 a_Color;
attribute float a_Scale;

uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;
uniform vec4 u_Color;
uniform vec2 u_TextureOffset;

varying vec3 v_DepthMapPosition;
varying vec2 v_TexturePosition;
varying vec4 v_Color;
varying float v_Alpha;

void main()
{  
	float scale = a_Scale;
	vec4 color = a_Color;
	
	vec4 p = u_ViewMatrix * vec4(a_MidPoint, 1.0);
	
	//vec3 position = (u_ViewMatrix * vec4(a_MidPoint + a_Position * scale, 1.0)).xyz;
	
	vec3 position = p.xyz + a_Position * scale * vec3(1.5, 1.0, 1.0);
	
	v_Alpha = clamp((p.z - 1.0) / 10.0, 0.0, 1.0);
	vec4 glPos = u_ProjectionMatrix * vec4(position, 1.0);
	gl_Position = glPos;
	vec3 depthMapPosition = glPos.xyz / glPos.w;
	depthMapPosition *= 0.5;
	depthMapPosition += 0.5;
	depthMapPosition.z = 1.0 - ((p.z - 1.0) / 500.0); // todo: remove hardcode
	v_DepthMapPosition = depthMapPosition;
	v_Color = color * u_Color;
	v_TexturePosition = a_TexturePosition + u_TextureOffset;
}