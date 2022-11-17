varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6

float fbm(vec2 vUv){
    float v = 0.;
    float amp = 0.5;
    float freq = 0.1;

    for( int i = 0; i < OCTAVES; i++){
        v += amp * noise(vUv + u_time * 0.25);
        vUv *= 2.;
        amp *= .5;
    }
    return v;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vec3 color = vec3(0.);
    vUv.x += u_time * 0.1;
    float y = fbm(vUv * 5. * fbm(vUv * 5. * fbm(vUv * 5.)));
    color.x = 1. - y;
    
    gl_FragColor = vec4(color, 1.);
}