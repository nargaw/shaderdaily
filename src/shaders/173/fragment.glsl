varying vec2 vUv;

uniform float u_time;

float rand(float x){
    return fract(sin(x)* 1e4);
}

//2D random
float rand(vec2 vUv){
    return fract(sin(dot(vUv.xy, vec2(23.74927,89.23476))) * 64827.27364872 + rand(u_time * 0.00001));
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

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec2 pos = vec2(vUv * 5.0);
    float n = noise(pos);
    vec3 color = vec3(0.);
    color.r =1. - n - 0.5;
    gl_FragColor = vec4(color, 1.);
}