varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//pixel deck
float circleSDF(vec2 vUv){
    return length(vUv - 0.5) * 2.;
}

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
    vec2 vUv = vec2(vUv-0.25);
    vUv *= 2.0;
    float angle = dot(vUv.y , vUv.x);
    float radius = length(vUv- 0.5) * 10.0;
    vec3 color = vec3 (cos(vUv.x), sin(vUv.y + u_time* 0.2), 0.);
    color *= vec3(step(circleSDF(vUv), 1.9));
    color *= hsb2rgb(vec3(u_time + radius * sin(vUv.x + vUv.y), u_time + radius, u_time + radius));
    gl_FragColor = vec4(color , 1.);
}