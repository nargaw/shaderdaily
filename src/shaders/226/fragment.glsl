varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 1.5 - 0.25;
    vec3 color = vec3(0.);
    //cellular noise loops
    vec2 point[6];
    point[0] = vec2(0.83 + sin(u_time * 0.25), 0.75);
    point[1] = vec2(0.60 - cos(u_time * 0.25), 0.1);
    point[2] = vec2(0.28 , 0.64 + sin(u_time * 0.25) );
    point[3] = vec2(0.31 , 0.26 - cos(u_time * 0.25));
    point[4] = vec2(0.50 + sin(u_time * 0.25), 0.50 + cos(u_time * 0.25) );
    point[5] = vec2(0.5, 0.5);
    float m_dist = 1.;

    for(int i = 0; i < 6; i++){
        float dist = distance(vUv, point[i]);
        m_dist = min(m_dist, dist);
    }
    color = vec3(smoothstep(.345, .511, abs(sin(50. * m_dist + cos(u_time * 2.)))));
    gl_FragColor = vec4(color, 1.);
}