import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdSeven(vec2(p.x -0.035, p.y));
        float right = sdFive(vec2(p.x - 0.39, p.y));
        return left + center + right;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        float shape1;
        float shape2;
        float shape3;
        vec2 newvUv = vUv;
        newvUv = Rot(newvUv, u_time * 4.);
        newvUv = newvUv / 2. - 0.25;
        float k = 1. + 20. * (0.25 - 0.125);
        
        for (int i=4; i<=15; i++)
        {
            shape1 += sdSpiral(vec2(newvUv), 0.45, k);
        }
        
        color += shape1;
        shape2 = rect(vec2(vUv.x, vUv.y), 1., 0.01);
        shape3 = rect(vec2(vUv.x, vUv.y), 0.01, 1.);
        color += shape2;
        color += shape3;
        

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader