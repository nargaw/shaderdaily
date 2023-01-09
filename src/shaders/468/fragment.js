import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdSix(vec2(p.x -0.035, p.y));
        float right = sdEight(vec2(p.x - 0.39, p.y));
        return left + center + right;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        float shape1;
        float shape2;
        vec2 newvUv = vUv;
        newvUv = newvUv * 2. - 1.;
        // newvUv = Rot(newvUv, u_time * 0.25);
        float k = 1. + 20. * (0.5 - 0.5 + (0.025 + (sin(u_time * 0.25) + .5)/015.));
        for (int i=3; i<=7; i++)
        {
            shape1 += sdSpiral(newvUv, 0.5* float(i), k);
            shape2 += sdSpiral(newvUv, 0.5* float(i), 5./k );
        }
        
        
        // float shape5 = sdPolygonOutline(vec2(vUv.x, vUv.y - 0.01), 3.0 + sin(u_time), 0.5);
        color += shape1;
        color *= shape2;

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader