import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdSix(vec2(p.x -0.035, p.y));
        float right = sdFive(vec2(p.x - 0.39, p.y));
        return left + center + right;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        float shape1;
        for (int i=4; i<=15; i++)
        {
            shape1 += sdPolygonOutline(vUv, i, float(i) * 0.1 + (sin(u_time)/2.) - 0.95);
        }
        
        
        // float shape5 = sdPolygonOutline(vec2(vUv.x, vUv.y - 0.01), 3.0 + sin(u_time), 0.5);
        color += shape1;

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader