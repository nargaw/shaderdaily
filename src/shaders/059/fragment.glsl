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
    return c.z * mix(vec3(1.0), rgb, c.y);
}

//pixel deck
float circleSDF(vec2 vUv){
    return length(vUv - 0.5) * 2.;
}

//rotation function
mat2 Rot(float a){
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
}

void main(){
    vec2 vUv = vec2(vUv.x - 0.5, vUv.y - 0.5);
    vUv *= 2.0;
    float t = u_time * .75;
    vUv *= Rot(t);
    float circle = circleSDF(vUv + 0.5);
    float angle = dot(vUv.y, vUv.x);
    float radius = length(vUv) * 100.0;
    vec3 color = vec3(0.);
    color = hsb2rgb(vec3((angle/TWO_PI * (u_time)) , sin(radius * sin(u_time * 0.25)), 1.0));
    color -=  tan(circle);
    gl_FragColor = vec4(color.x, color.y, color.z, 1.);
}