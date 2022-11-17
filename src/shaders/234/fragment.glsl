varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;

//#include "lygia/draw/circle.glsl"

//book of shaders
vec2 random2(vec2 p){
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv *= 2.;
    vec2 vUvI = floor(vUv);
    vec2 vUvF = fract(vUv);
    float m_dist = 0.5 * sin(u_time) + 2.0;
    for(int y = -1; y <= 1; y++){
        for (int x = -1; x <= 1; x ++){
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = random2(vUvI + neighbor);
            point = 0.5 + 0.5 * cos(u_time + TWO_PI * point);
            vec2 diff = neighbor + point - vUvF;
            float dist = length(diff) ;
            m_dist = min(m_dist, dist);
            
        }
    }
    color.rg += m_dist;
    color.rg += 1.- smoothstep(0.01, 0.011, m_dist);
    gl_FragColor = vec4(color, 1.);
}