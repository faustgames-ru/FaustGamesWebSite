precision mediump float;
uniform sampler2D u_SpecularMap;
uniform sampler2D u_DiffuseMap;
uniform sampler2D u_NormalMap;
uniform sampler2D u_GlowMap;
uniform vec4 u_SpecularLight;
uniform vec4 u_DiffuseLight;
uniform vec4 u_AmbientLight;
uniform vec4 u_GlowColor;
varying vec2 v_TexturePosition;
varying vec3 v_Light;
varying vec3 v_HalfVector;
varying float v_GlowLevel;
varying float v_distance;
varying vec3 v_RayDirection;
varying vec3 v_SunDirection;
varying vec3 v_Eye;

const float u_FogDensity = 0.01;
const float u_FogZDensity = 50.0;

const vec3 R = vec3( 64.0, 64.0, 64.0 );
const vec3 C = vec3( 0.0, 0.0, 0.0 );

vec4 applySunFog(
  in vec4  rgb,      // original color of the pixel
    in float distance, // camera to point distance
    in vec3  rayDir,   // camera to point vector
    in vec3  sunDir )  // sun light direction
{
    float fogAmount = 1.0 - exp( -distance*u_FogDensity );
    float sunAmount = max( dot( rayDir, sunDir ), 0.0 );
    vec4  fogColor  = mix( vec4(0.5,0.6,0.7,1.0), // bluish
                           vec4(1.0,0.9,0.7,1.0), // yellowish
                           clamp(pow(sunAmount,1.0), 0.0, 1.0) );
    return mix( rgb, fogColor, clamp(fogAmount, 0.0, 1.0) );
}

vec4 applyPlanarFog(
  in vec4  rgb,      // original color of the pixel
  in float distance, // camera to point distance
  in vec3  eye,   // camera to point vector
  in vec3  ray,   // camera to point vector
  in vec3  sunDir )  // sun light direction
{
  float d = u_FogZDensity;
    float at = min(max((-eye.y - d) / ray.y, 0.0), distance);
    float bt = min(max((-eye.y + d) / ray.y, 0.0), distance);
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
	vec3 halfVector = normalize(v_HalfVector);
	vec3 normal = normalize(2.0 * texture2D (u_NormalMap, v_TexturePosition).rgb - 1.0);
	float lamberFactor= max(dot (normalize(v_Light), normal), 0.0);
	vec4 glowMaterial = texture2D (u_GlowMap, v_TexturePosition) * (1.0 - lamberFactor) * v_GlowLevel;
	gl_FragColor = u_AmbientLight;
	gl_FragColor += max(glowMaterial, 0.0) * u_GlowColor;
	vec4 diffuseMaterial = texture2D (u_DiffuseMap, v_TexturePosition);
	vec4 specularMaterial = texture2D (u_SpecularMap, v_TexturePosition);
	//float shininess = pow (max(dot (halfVector, normal), 0.0), 2.0);
	float shininess = pow (abs(dot (halfVector, normal)), 2.0);
	gl_FragColor += diffuseMaterial * u_DiffuseLight * lamberFactor;
	gl_FragColor += specularMaterial * u_SpecularLight * shininess;
	
	//gl_FragColor = applySunFog(gl_FragColor, v_distance,  normalize(v_RayDirection), normalize(v_SunDirection));
	//gl_FragColor = applyPlanarFog(gl_FragColor, v_distance, v_Eye, normalize(v_RayDirection), normalize(v_SunDirection));
	gl_FragColor = applyEllipticFog(gl_FragColor, v_distance, v_Eye, normalize(v_RayDirection), normalize(v_SunDirection));
	
}