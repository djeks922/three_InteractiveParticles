uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

attribute vec3 displacement;

varying vec2 vUv;
varying vec3 vposition;


#define PI 3.14159265358979323846
float rand(vec2 c){
	return fract(sin(dot(c.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p, float freq ){
	float unit = 8./freq;
	vec2 ij = floor(p/unit);
	vec2 xy = mod(p,unit)/unit;
	//xy = 3.*xy*xy-2.*xy*xy*xy;
	xy = .5*(1.-cos(PI*xy));
	float a = rand((ij+vec2(0.,0.)));
	float b = rand((ij+vec2(1.,0.)));
	float c = rand((ij+vec2(0.,1.)));
	float d = rand((ij+vec2(1.,1.)));
	float x1 = mix(a, b, xy.x);
	float x2 = mix(c, d, xy.x);
	return mix(x1, x2, xy.y);
}

float pNoise(vec2 p, int res){
	float persistance = .5;
	float n = 0.;
	float normK = 0.;
	float f = 4.;
	float amp = 1.;
	int iCount = 0;
	for (int i = 0; i<50; i++){
		n+=amp*noise(p, f);
		f*=2.;
		normK+=amp;
		amp*=persistance;
		if (iCount == res) break;
		iCount++;
	}
	float nf = n/normK;
	return nf*nf*nf*nf;
}

vec3 disp(float x, float y ,float z) {
    float dist = distance(uMouse,vec2(x,y));
    float cond = 1.-step(0.05,dist);
    float nx = cond *sin(pNoise(vec2(x*10.,y*10.),10))*1.;
    float ny = cond *sin(pNoise(vec2(y*10.,x*10.),10))*1.;
    float nz = cond *sin(pNoise(vec2(y*x*5.,x+y*5.),10))*1.;
    return vec3(nx,ny,nz);
}

void main(){
    vposition=position;
    vUv = uv;


    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    vec3 d = disp(modelPosition.x,modelPosition.y,modelPosition.z);
    
    //displacement
    modelPosition.x += sin(d.x*uTime*20.)*0.01 +d.x;
    modelPosition.y += sin(d.y*uTime*20.)*0.01 +d.y;
    modelPosition.z += sin(d.z*uTime*20.)*0.01 +d.z;



    vec4 viewPosition = viewMatrix * modelPosition;
    
   
    vec4 projectionPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectionPosition;

    gl_PointSize = 1.0 * (1.0 / - viewPosition.z);
    
}