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

vec2 Rot(vec2 vUv,float a){
    //vUv *= 2.0;
    vUv-=.5;
    vUv=mat2(cos(a),-sin(a),
    sin(a),cos(a))*vUv;
    vUv+=.5;
    return vUv;
}

float sqr(vec2 vUv,vec2 size){
    vec2 b=smoothstep(size,size+vec2(.013),vUv);
    b*=smoothstep(size,size+vec2(.013),1.-vUv);
    float box1=b.x*b.y;
    vec2 b2=smoothstep(size-vec2(.013),(size-vec2(.031))+vec2(.031),vUv);
    b2*=smoothstep(size-vec2(.013),(size-vec2(.031))+vec2(.031),1.-vUv);
    float box2=b2.x*b2.y;
    return box2-box1;
}
vec2 tile(vec2 _st, float _zoom){
    _st *= _zoom;
    return fract(_st);
}

vec2 movingTiles(vec2 _st, float _zoom, float _speed){
    _st *= _zoom;
    float time = u_time*_speed;
    if( fract(time)>0.5 ){
        if (fract( _st.y * 0.5) > 0.5){
            _st.x += fract(time)*2.0;
        } else {
            _st.x -= fract(time)*2.0;
        }
    } else {
        if (fract( _st.x * 0.5) > 0.5){
            _st.y += fract(time)*2.0;
        } else {
            _st.y -= fract(time)*2.0;
        }
    }
    return fract(_st);
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv.y -= 2.5;
    float noise = snoise(vUv + (u_time * 0.5));
    vUv = movingTiles(vec2(sin(vUv.x) + noise * 0.01, cos(vUv.y) + noise * 0.01), 4., 0.15);
    vec3 color = vec3(0.);
    vec2 vUv2 = Rot(vUv, PI * 0.25);
    vUv = Rot(vUv, u_time * 0.25 );
    //vUv2 = Rot(vUv2, -u_time * 0.25  );
    float y1 = sqr(vUv + (noise * 0.05), vec2(0.25));
    float y2 = sqr(vUv2 + (noise * 0.05), vec2(0.2));
    float y3 = sqr(vUv + (noise * 0.05), vec2(0.25 * 1.75));
    float y4 = sqr(vUv2 + (noise * 0.05), vec2(0.2 * 1.75));
    float y5 = sqr(vUv + (noise * 0.05), vec2(0.25 * 2.));
    float y6 = sqr(vUv2 + (noise * 0.05), vec2(0.2 * 2.));
    float y7 = sqr(vUv + (noise * 0.05), vec2(0.25 * 1.5));
    float y8 = sqr(vUv2 + (noise * 0.05), vec2(0.2 * 1.5));
    color = vec3(y1 + y2 + y3 + y4 + y5 + y6 + y7 + y8);
    gl_FragColor = vec4(color, 1.);
}