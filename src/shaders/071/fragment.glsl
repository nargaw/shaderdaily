varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main(){
    vec3 color = vec3(0.);
    //a
    float pct = smoothstep(0.1, 0.15, distance(vUv, vec2(0.8 * cos(u_time), 1. * abs(sin(u_time)))));
    float pct2 = smoothstep(0.1, 0.15, distance(vUv, vec2(0.5, 1. * abs(cos(u_time)))));
    float pct3 = smoothstep(0.1, 0.15, distance(vUv, vec2(0.2, 1. * abs(sin(u_time)))));
    color = vec3(pct);
    color *= vec3(pct2);
    color *= vec3(pct3);

    color.x = sin(color.x * u_time * 0.25);
    color.y = sin(color.y * u_time * 0.25);
    color.z = sin(color.z * u_time * 0.25); 
    // //b
    // vec2 vUv = vec2(vUv) - 0.5;
    // float pct = length(vUv);
    // color = vec3(pct);

    // //c
    // vec2 vUv = vec2(vUv) - 0.5;
    // float pct = sqrt(vUv.x * vUv.x + vUv.y * vUv.y);
    // color = vec3(pct);
    gl_FragColor = vec4(color, 1.);
}