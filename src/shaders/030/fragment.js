import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
#define PI 3.1415926535897932384626433832795
uniform float u_time;

vec2 getRadialUv(vec2 vUv){
    float angle = atan(vUv.x, vUv.y);
    vec2 radialUv = vec2(0.);
    radialUv.x = angle/(PI * 2. ) + .9 *abs(cos(u_time));
    radialUv.y = 1. - pow(1. - length(vUv), 4.);
    return radialUv;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv -= 0.5;
    vec2 radialUv = getRadialUv(vUv);
    vec2 color = vec2(radialUv);
    gl_FragColor = vec4(color, 1., 0.);
}
    `

export default fragmentShader