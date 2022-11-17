import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
    glsl`
    varying vec2 vUv;
#define TWO_PI 6.28318530718
uniform float u_time;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb(in vec3 c){
    vec3 rgb=clamp(abs(mod(c.x*6.+vec3(3.8,1.,7.),
6.)-3.)-1.,
0.,
1.);
rgb=rgb*rgb*(3.-2.*rgb);
return c.z*mix(vec3(1.),rgb,c.y);
}

mat2 Rot(float a){
    float s=sin(a);
    float c=cos(a);
    return mat2(c,-s,s,c);
}

void main(){
    vec2 centeredUv=vec2(vUv.x-.5,vUv.y-.5);
    centeredUv*=10.;
    float t=u_time*.05;
    centeredUv*=Rot(t*10.);
    vec3 color=vec3(0.);
    float angle=abs(tan(dot(abs(cos(centeredUv.x)), abs(sin(centeredUv.y)))) * abs(cos(u_time * 0.5)));
    float radius=length(centeredUv)*2000.;
    color=1. - hsb2rgb(vec3((angle/(TWO_PI /3.))+.5,radius, 1.));
    gl_FragColor=vec4(color.x , color.y, color.z ,1.);
}
    `

export default fragmentShader