uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform sampler2D uTexture;

varying vec2 vUv;
varying vec3 vposition;
// varying vec3 vPosition;
// varying vec3 vNormal;

void main () {
    float dist = distance(gl_PointCoord,vec2(0.5));
    float p = 1.-smoothstep(0.5,0.52,dist);
    vec2 newUv = vec2(1.,0.) * p;
    gl_FragColor = vec4(newUv,0.0,1.0);
    // gl_FragColor  = texture2D(uTexture,vUv);

}