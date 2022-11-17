varying vec2 vUv;

uniform float u_time;

// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
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
    vUv = vUv * 2. - 1.;
    vec3 color = vec3(0.);
    vec2 pos = vec2(vUv * 2.);
    pos = Rot(pos, u_time);
    float y = noise(pos + sin(u_time));
    float d = length( max(abs(vUv)-(.13 * sin(u_time * 0.25) * 2.),0.));
    color = vec3(y * (fract(d * 10.0)));
    gl_FragColor = vec4(color, 1.);
}