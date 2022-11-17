
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

    vec2 u = f * f * (3.0 - 2.0 * f) ;

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.1;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st + (u_time * 0.5));
        st *= 5.;
        //st.x += u_time * 0.25;
        amplitude *= .125;
    }
    return value;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    vUv = vUv * 2.75;
    vUv.x += u_time * 0.25;
    vec3 color = vec3(0.);
    float x = fbm(vUv * 1.0 + fbm(vUv * 2.0 + fbm(vUv * 3. + fbm(vUv * 4. + fbm(vUv * 5.)))));
    x += x - noise(vUv + u_time * 0.1);
    vec2 q = vec2(0.);
    q.x = fbm( vUv);
    q.y = fbm( vUv);

    vec2 r = vec2(0.);
    r.x = fbm( vUv + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
    r.y = fbm( vUv + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);
    //x += x * sin(u_time * 0.15);
    //color += x;
    //color.x += sin(u_time * 0.05);
    color = mix(color,
                vec3(0.0,0.,0.54706),
                clamp(length(x - r),0.0,1.0));

    color = mix(color,
                vec3(0.96667,0.2,.0),
                clamp(length(x - q),0.0,1.0));
    gl_FragColor = vec4(color, 1.);
}