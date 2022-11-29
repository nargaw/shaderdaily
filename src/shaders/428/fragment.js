import glsl from 'babel-plugin-glsl/macro'

const fragmentShader =
glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.1;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdTwo(vec2(p.x, p.y));
        float right = sdEight(vec2(p.x - 0.35, p.y));
        return left + center + right;
    }

    float newfunc(vec2 p, float a)
    {
        p = p * 5. - 2.5;
        p.y -= 1.25;
        p.x += 0.5;
        float c;
        float steps = 15.;
        for(float i = 1.; i < steps; i++)
        {
            c += sdCircle(vec2(p.x  + i/ 4. * (sin(u_time * i * 0.25)), p.y + i / 4. ), a);
        }
        
        return c;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        float x = newfunc(vUv, 0.25);
        color += x;
        float num = label(vUv);
        color += num;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader