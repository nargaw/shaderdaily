
varying vec2 vUv;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform float u_time;
uniform vec2 u_mouse;

// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}


float ridge(float h, float offset) {
    h = abs(h);     // create creases
    h = offset - h; // invert so creases are at top
    h = h * h * h * h;      // sharpen creases
    return h;
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.1;
    float lacunarity = 2.0;
    float prev = 1.0;
    float offset = 0.9;
    float gain = 0.5;
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        float n = ridge(snoise(st * frequency + (u_time * 0.25)), offset);
        value += n * amplitude;
        value += n * amplitude * prev;
        prev = n;
        frequency *= lacunarity;
        //st.x += u_time * 0.25;
        amplitude *= gain;
    }
    return value;
}

void main(){
    vec2 vUv = vec2(vUv.x, vUv.y);
    // vUv = vUv * 1.75;
    //vUv.x += u_time * 0.1;
    vec3 color = vec3(0.);
    float x = fbm(vUv * 1.0 + snoise(vUv + u_time * 0.01) - fbm(vUv * 5. - fbm(vUv * 10. + fbm(vUv ))));
    color += 1. - x;
    vec2 q = vec2(0.);
    q.x = fbm( vUv);
    q.y = fbm( vUv);

    vec2 r = vec2(0.);
    r.x = fbm( vUv + 1.0*q + vec2(1.7,9.2)+ 0.0125*u_time );
    r.y = fbm( vUv + 1.0*q + vec2(8.3,2.8)+ 0.0126*u_time);
    //x += x * sin(u_time * 0.15);
    //color += x;
    //color.x += sin(u_time * 0.05);
    // color = mix(color,
    //             vec3(0.2,0.4,0.64706),
    //             clamp(length(r),0.0,0.5));

    color = mix(color,
                vec3(0.966667,0.,0.),
                clamp(length(x),0.0,1.0));
    gl_FragColor = vec4(color, 1.);
}