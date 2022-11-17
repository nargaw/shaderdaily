varying vec2 vUv;
#define TWO_PI 6.28318530718
uniform float u_time;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix( vec3(1.0), rgb, c.y);
}

mat2 Rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main(){
    vec2 centeredUv = vec2(vUv.x - 0.5, vUv.y - 0.5);
    centeredUv *= 10.0;
    float t = u_time * .05;
    //vUv += M;
    centeredUv *= Rot(t * 10.0);
    vec3 color = vec3(0.);
    float angle = dot(sin(centeredUv.y), sin(centeredUv.x));
    float radius = length(centeredUv) * 200.0;
    color = 1. - hsb2rgb(vec3((angle * abs(tan(sin(u_time * 0.25)))) - 0.25, radius, 1.));
    gl_FragColor = vec4(color, 1.);
}