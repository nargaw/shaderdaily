varying vec2 vUv;
#define PI 3.14159265359
uniform float u_time;

//pixel deck
float fill(float x, float size){
    return 1. - step(size, x);
}
//pixel deck
//triangle SDF
float triSDF(vec2 vUv){
    vUv = (vUv * 2. - 1.) * 2.;
    return max(abs(vUv.x) * 0.866025 + vUv.y * 0.5, -vUv.y * 0.5);
}

//rotation function
mat2 Rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
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
    vec2 vUv = vec2(vUv);
    vec3 color = vec3(0.);
    float angle = dot(vUv.y , vUv.x);
    float radius = length(vUv- 0.5) * 10.0;
    float tri = 1. - fill(triSDF(vUv), 0.5);
    float tri2 = fill(triSDF(vec2(vUv.x, vUv.y + 0.1)), 0.4);
    float tri3 = 1. - fill(triSDF(vec2(vUv.x, vUv.y + 0.2)), 0.3);
    float shape = float(tri + tri2 * tri3);
    color = vec3(shape);
    color += hsb2rgb(vec3(u_time + radius * sin(vUv.x - 0.25 + vUv.y), u_time + radius, u_time + radius));
    gl_FragColor = vec4(vec3(shape, shape + color.y, shape), 1.);
}