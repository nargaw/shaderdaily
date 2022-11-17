varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;

//book of shaders
vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 2. - 1.;
    vec3 color = vec3(0.);
    //cellular noise loops
   //scale
   vUv *= 3.;

   //tile the space
   vec2 vUvI = floor(vUv);
   vec2 vUvF = fract(vUv);
   float m_dist = 1.; //min distance

    //double loop
    for (int y = -1; y <= 1; y++){
        for (int x = -1; x <= 1; x++){
            //neighbor grid
            vec2 neighbor = vec2(float(x), float(y));
            //random position from current and neighbor place in grid
            vec2 point = random2(vUvI + neighbor);
            //animate points
            point = 0.5 + 0.5 * sin(u_time + TWO_PI * point);
            //vector b/n pixel and point
            vec2 diff = neighbor + point - vUvF;
            //distance to the point
            float dist = length(diff);
            //closer distance
            m_dist = min(m_dist, dist);
        }
    }

    color += m_dist;
    //center cell
    color += 1. - step(0.02, m_dist);
    gl_FragColor = vec4(color, 1.);
}