import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdSeven(vec2(p.x -0.035, p.y));
        float right = sdTwo(vec2(p.x - 0.39, p.y));
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
        newvUv = newvUv * 3. - 1.;
        newvUv = Rot(newvUv, u_time * 0.25);
        
        for (int i=4; i<=10; i++)
        {
            // shape1 += sdEqTriangleOutline(vec2(newvUv.x + sin(float(i) * u_time * 0.25), newvUv.y + cos(float(i) * u_time * 0.25)), 0.3 * (float(i) * 0.1));
            shape2 += sdPolygonOutline(vec2(newvUv.x + sin(float(i) * u_time * 0.0725), newvUv.y + sin(float(i) * u_time * 0.0725)), 4, 0.1 * (float(i) - 0.125));
            shape3 += sdPolygonOutline(vec2(newvUv.x - sin(float(i) * u_time * 0.0725), newvUv.y - sin(float(i) * u_time * 0.0725)), 4, 0.1 * (float(i) - 0.125));
            
        }
        
        
        // float shape5 = sdPolygonOutline(vec2(vUv.x, vUv.y - 0.01), 3.0 + sin(u_time), 0.5);
        // color += shape1;
        color += shape2;
        color *= shape3;

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader