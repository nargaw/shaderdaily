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

//book of shaders
float plot (vec2 st, float pct){
  return  smoothstep( pct-0.5, pct, st.y) -
          smoothstep( pct, pct+0.5, st.y);
}

//rotation function
mat2 Rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main(){
    vec2 vUv = vec2(vUv - 0.5);
    vUv *= 4.0 + sin(u_time);
    float t = u_time * .75;
    vUv *= Rot(t);
    vec3 color = vec3(0.);
    color += 1. - hsb2rgb(vec3(cos(vUv.x * vUv.y), u_time * PI, 1.0));
    gl_FragColor = vec4(color, 1.);
}