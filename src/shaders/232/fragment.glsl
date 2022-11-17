varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;

//book of shaders
vec2 random2(vec2 p){
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453) + (u_time * 0.25);
}

//simplex noise book of shaders
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,  // -1.0 + 2.0 * C.x
                        0.024390243902439); // 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color=vec3(0.);
    vUv *= 5.;
    vUv.x +=  u_time;
    vec2 vUvI=floor(vUv);
    vec2 vUvF=fract(vUv);
    float n = snoise(vUv + u_time) * 0.1;
    //vUv*=scale;
    float minDist = 1.;
    for(int y=-2;y<=2;y++){
        for(int x=-2;x<=2;x++){
            vec2 neighbor=vec2(float(x),float(y));
            vec2 point=random2(vUvI+neighbor ) + n;
            point=.5+.5*sin(u_time+TWO_PI*point);
            // point.x = point.x + n;
            // point.y = point.y + n;
            vec2 diff=neighbor+point-vUvF;
            float dist=length(diff + n);
            minDist=min(minDist,dist);
        }
    }
    color += minDist;
    //color += 1. - step(0.1, minDist);
    //color.r += step(.98, vUvF.x) + step(.98, vUvF.y);
    gl_FragColor = vec4(color, 1.);
}