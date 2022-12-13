import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdFour(vec2(p.x -0.05, p.y));
        float right = sdTwo(vec2(p.x - 0.35, p.y));
        return left + center + right;
    }

    // vec3 sdgBox(vec2 p, vec2 b)
    // {
    //     vec2 w = abs(p) - b;
    //     vec2 s = vec2(p.y < 0. ? -1. : 1., p.x < 0. ? -1. : 1.);
    //     float g = max(w.x, w.y);
    //     vec2 q = max(w, 0.0);
    //     float l = length(q);
    //     vec3 x = vec3((g > 0.0) ? l : g, s * ((g > 0.0) ? q /l : ((w.x > w.y) ? vec2(1., 0.) : vec2(0., 1.))));
    //     return smoothstep(0.01, 0.02, x);
    // }

    vec3 sdgCircle(vec2 p, float r)
    {
        float d = length(p);
        return vec3(d -r, p /d);
    }
    

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        
        vec3 color = vec3(0.);
        float numLabel = label(vUv);
        
        vUv = Rot(vUv, u_time);
        vUv = vUv * 6. - 3.;
        
        float ra = 0.5;
        vec3 cir = 1. - sdgCircle(vUv, ra);
        float d = cir.x;
        vec2 g = cir.yz;
        
        color += (d > 0.) ? vec3(1.) : vec3(0.0);
        color *= 1.0 + vec3(0.5 * g, 0.0);
        color *= 1.0 - 0.5 * exp(-16.0 * abs(d));
        color *= 0.5 + 0.1 * cos(150.0 * d);
        color = mix(color, vec3(1.0), 1.0 - smoothstep(0.0, 0.01, abs(d)));
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader