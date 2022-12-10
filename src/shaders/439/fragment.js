import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdThree(vec2(p.x -0.05, p.y));
        float right = sdNine(vec2(p.x - 0.36, p.y));
        return left + center + right;
    }

    float newfunc(vec2 p, float a)
    {
        p = p * 8. - 3.;
        p*= 0.5;
        float b;
        float steps = 15.;
        for(float i = 1.; i<steps; i++)
        {
            // p = p * sin(u_time);
            p = Rot(p, (sin(u_time * i/15.)));
            b += cirOutline(vec2(p.x + sin(u_time * i/15. + i), p.y + cos(u_time * i/15. + i)), 0.5 * (i + sin(u_time)) * 0.25);
        }
        return b;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        float numLabel = label(vUv);
        color += numLabel;
        float n = newfunc(vUv, 0.5);
        color += n;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader