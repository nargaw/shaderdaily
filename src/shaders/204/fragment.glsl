varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;

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

float plot(vec2 vUv,float p){
    float x = snoise(vUv + u_time * 0.1);
    p += x;
    return smoothstep(p+(.045),p,vUv.y)-
    smoothstep(p,p-(.045),vUv.y);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 2. - 2.;
    vUv.x += 1.0;
    vec3 color = vec3(0.);
    float noise = snoise(vUv + u_time);
    float x = vUv.x;
    float y1 =  x*x*x*(x*(x*6.-15.)+10.);
    float pct1 = plot(vec2(vUv.x - 2.5, vUv.y), y1);
    float y2 =  x*x*(3.0-2.0*x);
    float pct2 = plot(vec2(vUv.x - 2.0, vUv.y), y2);
    float y3 =  x*x*x*(x*(x*6.-15.)+10.);
    float pct3 = plot(vec2(vUv.x - 1.5, vUv.y), y3);
    float y4 =  x*x*(3.0-2.0*x);
    float pct4 = plot(vec2(vUv.x -1.0, vUv.y), y4);
    float y5 =  x*x*x*(x*(x*6.-15.)+10.);
    float pct5 = plot(vec2(vUv.x , vUv.y), y5);
    float y6 =  x*x*(3.0-2.0*x);
    float pct6 = plot(vec2(vUv.x + 1.0, vUv.y), y6);
    float y7 =  x*x*x*(x*(x*6.-15.)+10.);
    float pct7 = plot(vec2(vUv.x + 1.5, vUv.y), y7);
    float y8 =  x*x*(3.0-2.0*x);
    float pct8 = plot(vec2(vUv.x + 2.0, vUv.y), y8);
    float y9 =  x*x*x*(x*(x*6.-15.)+10.);
    float pct9 = plot(vec2(vUv.x + 2.5, vUv.y), y9);
    float y10 =  x*x*(3.0-2.0*x);
    float pct10 = plot(vec2(vUv.x + 3.5, vUv.y), y10);
    color = vec3(pct1 + pct2 + pct3 + pct4 + pct5 + pct6 + pct7 + pct8 + pct9 + pct10);
    gl_FragColor = vec4(color, 1.);
}