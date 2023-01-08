import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdSix(vec2(p.x -0.035, p.y));
        float right = sdSeven(vec2(p.x - 0.39, p.y));
        return left + center + right;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        float shape1;
        float shape2;
        vec2 newvUv = vUv;
        newvUv = newvUv * 2. - 0.5;
        newvUv = Rot(newvUv, u_time * 0.25);
        for (int i=3; i<=7; i++)
        {
            shape1 += sdPolygonOutline(vec2(newvUv.x, newvUv.y + sin(float(i)/1.)), i, float(i) * 0.1 + (sin(u_time * float(i) * 0.5)/1.) - 0.95);
            shape2 += sdPolygonOutline(vec2(newvUv.x + cos(float(i)/1.), newvUv.y ), i, float(i) * 0.1 + (cos(u_time * float(i) * 0.5)/1.) - 0.95);
        }
        
        
        // float shape5 = sdPolygonOutline(vec2(vUv.x, vUv.y - 0.01), 3.0 + sin(u_time), 0.5);
        color += shape1;
        color += shape2;

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader