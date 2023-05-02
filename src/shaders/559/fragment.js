import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdFive(vec2(p.x -0.03, p.y));
        float right = sdNine(vec2(p.x - 0.42, p.y));
        return left + center + right;
    }


    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        float z = sdZero(vUv);
        // color += z;

        vec2 newUv = vUv;
        newUv.x += 0.125;
        newUv.y -= 0.25;
        vec2 uv1 = newUv;
        vec2 uv2 = newUv;
        vec2 uv3 = newUv;
        vec2 uv4 = newUv;
        uv1 = Rot(uv1, PI * 0.5);
        uv1 /= .5;
        uv1 -= 1.;

        uv2 = Rot(uv2, -PI* .5);
        uv2 /= .5;
        uv2 -= 1.;

        uv3 = Rot(uv3, PI * 2.);
        uv3 /= .51;
        // uv3 -= 1.;
        
        float shape1 = sdEqTriangle(uv1, 0.15);
        color += 1. - smoothstep(0.1, 0.11, shape1);

        float shape2 = sdBox(vec2(uv1.x + 0.5, uv1.y+0.75), vec2(0.315));
        color += 1. - smoothstep(0.1, 0.11, shape2);

        float shape3 = sdEqTriangle(vec2(uv2.x, uv2.y-0.5), 0.15);
        color += 1. - smoothstep(0.1, 0.11, shape3);

        float shape4 = sdTriIsosceles(vec2(uv3.x+0.1, uv3.y), vec2(0.05, 0.1));
        color += 1. - smoothstep(0.1, 0.11, shape4);

        float shape5 = trapezoid(uv2, 0.2, 0.3, 0.2);
        color += 1. - smoothstep(0.01, 0.011, shape5);

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader