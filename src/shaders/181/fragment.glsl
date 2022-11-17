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

float lines(vec2 vUv, float b){
    float s = 10.0;
    vUv *= s;
    return smoothstep(0.45, .45+b * .451, abs((sin(vUv.x * 3.1415) + b * 1.)) * .5);
}

vec2 Rot(vec2 vUv, float a){
    vUv -= 0.5;
    vUv = mat2(cos(a), -sin(a),
               sin(a), cos(a)) * vUv;
    vUv += 0.5;
    return vUv;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv -= .25;
    vUv.x += sin(u_time) * 0.2;
    vec3 color = vec3(0.);
    vUv = vUv.yx * vec2(3., 3.);
    vUv = Rot(vUv, u_time * 0.2);
    vUv = noise(vUv) * vUv + u_time * 0.025;
    vUv.x = noise(vUv) * vUv.x;
    vUv.y = noise(vUv) * vUv.y;
    float p = vUv.x;
    p = lines(vUv, .5);
    color = vec3(p);
    gl_FragColor = vec4(color, 1.);
}