varying vec2 vUv;

uniform float u_time;

//2D random
float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(23.74927,89.23476))) * 64827.27364872);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float cir(vec2 vUv,vec2 pos,float size){
    vUv = vec2(0.5) - vUv;
    float f = size * 1.5;
    float r = length(vUv) * 2.0;
    float a = atan(vUv.y, vUv.x);
    float m = abs(mod(a + u_time * 2., 3.14 * 2.) - 3.14)/3.6;
    m += noise(vUv + u_time * 0.1) * .5;
    f += sin(a * 20.) * noise(vUv + u_time * .02) * 0.1;
    f -= sin(a * 10.) * .1 * pow(m, 2.);
    float x = 1.-smoothstep(size,size+.01,distance(vUv,pos));
    float y = 1.-smoothstep(size + 0.05, size + 0.02+0.01, distance(vUv, pos));
    return smoothstep(f, f + 0.007, r);
}

float boarder(vec2 vUv, float size, float w){
    return cir(vUv, vec2(0.0), size ) - cir(vUv, vec2(0.0), size + w); 
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    float y = boarder(vUv, 0.5, 0.04);
    float y2 = boarder(vUv, 0.3, 0.04);
    float y3 = boarder(vUv, 0.1, 0.04);
    color = vec3(y + y2 + y3);
    gl_FragColor = vec4(color, 1.);
}