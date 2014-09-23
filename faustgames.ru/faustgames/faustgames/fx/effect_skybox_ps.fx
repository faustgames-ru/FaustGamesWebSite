precision mediump float;

uniform sampler2D u_Texture;
uniform vec4 u_Color;

const float u_FogDensity = 0.01;
const float u_FogZDensity = 50.0;

const vec3 R = vec3( 64.0, 64.0, 64.0 );
const vec3 C = vec3( 0.0, 0.0, 0.0 );


varying vec2 v_TexCoordinate;
varying float v_distance;
varying vec3 v_RayDirection;
varying vec3 v_SunDirection;
varying vec3 v_Eye;

vec4 applySunFog(
	in vec4  rgb,
    in float distance,
    in vec3  rayDir,
    in vec3  sunDir )
{
    float fogAmount = 1.0 - exp( -distance*u_FogDensity );
    float sunAmount = max( dot( rayDir, sunDir ), 0.0 );
    vec4  fogColor  = mix( vec4(0.5,0.6,0.7,1.0), // bluish
                           vec4(1.0,0.9,0.7,1.0), // yellowish
                           clamp(pow(sunAmount,8.0), 0.0, 1.0) );
    return mix( rgb, fogColor, clamp(fogAmount, 0.0, 1.0) );
}

vec4 applyPlanarFog(
	in vec4  rgb,
	in float distance,
	in vec3  eye,
	in vec3  ray,
	in vec3  sunDir )
{
	float d = u_FogZDensity;
    float at = max((-eye.y - d) / ray.y, 0.0);
    float bt = max((-eye.y + d) / ray.y, 0.0);
	float dist = abs(bt - at);
    float fogAmount = 1.0 - exp( -dist*u_FogDensity );

	float sunAmount = max( dot( ray, sunDir ), 0.0 );
    vec4  fogColor  = mix( vec4(0.5,0.6,0.7,1.0), // bluish
                           vec4(1.0,0.9,0.7,1.0), // yellowish
                           clamp(pow(sunAmount,1.0), 0.0, 1.0) );
    return mix( rgb, fogColor, clamp(fogAmount, 0.0, 1.0) );
}

vec4 applyEllipticFog(
	in vec4  rgb,
	in float distance,
	in vec3  eye,
	in vec3  ray,
	in vec3  sunDir)
{
	vec3 d = normalize(ray);
	vec3 o = eye;

	vec3 Axyz = d / R;
	vec3 Bxyz = (o - C) / R;
	
	float a = Axyz.x * Axyz.x + Axyz.y * Axyz.y + Axyz.z * Axyz.z;
	float b = 2.0 * (Axyz.x * Bxyz.x + Axyz.y * Bxyz.y + Axyz.z * Bxyz.z);
	float c = Bxyz.x * Bxyz.x + Bxyz.y * Bxyz.y + Bxyz.z * Bxyz.z - 1.0;
	
	float kpow2 = max(b*b - 4.0*a*c, 0.0);
	
	float k = sqrt(kpow2);
	float a2 =2.0*a;
	float t1 = (-b + k ) / a2;
	float t2 = (-b - k ) / a2;
    float at = min(max(t1, 0.0), distance);
    float bt = min(max(t2, 0.0), distance);

	float dist = abs(bt - at);

    float fogAmount = 1.0 - exp( -dist*u_FogDensity );
		
	float sunAmount = max( dot( ray, sunDir ), 0.0 );
	float sunK = clamp(pow(sunAmount,8.0), 0.0, 1.0);
    vec4  fogColor  = mix( vec4(0.5,0.6,0.7,1.0), // bluish
                           vec4(1.0,0.9,0.7,1.0), // yellowish
                           sunK );
	
	return mix( rgb, fogColor, clamp(fogAmount, 0.0, 1.0) );
}

void main() 
{
	vec4 color = texture2D(u_Texture, v_TexCoordinate) * u_Color;
	gl_FragColor = color;
	gl_FragColor = applyEllipticFog(gl_FragColor, v_distance, v_Eye, normalize(v_RayDirection), normalize(v_SunDirection));
	//gl_FragColor = applyPlanarFog(gl_FragColor, v_distance, v_Eye, normalize(v_RayDirection), normalize(v_SunDirection));
}