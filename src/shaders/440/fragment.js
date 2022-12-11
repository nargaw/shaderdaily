import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdFour(vec2(p.x -0.05, p.y));
        float right = sdZero(vec2(p.x - 0.38, p.y));
        return left + center + right;
    }

    float newfunc(vec2 p, float a)
    {
        p = p * 8. - 3.;
        p*= 0.5;
        float b;
        float steps = 25.;
        for(float i = 1.; i<steps; i++)
        {
            // p = p * sin(u_time);
            // if(i < 12.)
            // {
            //     p = Rot(p, (cos(u_time * i/50.)));
            // } else 
            // {
            //     p = Rot(p, (sin(u_time * i/50.)));
            // }

            p = Rot(p, (sin(u_time * i/50.)));
            b += cirOutline(vec2(p.x + 0.75, p.y + sin(u_time * i/25. + 5.)), 0.5);
            b += cirOutline(vec2(p.x - 0.75, p.y + sin(u_time * i/25. + 5.)), 0.5);

           
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