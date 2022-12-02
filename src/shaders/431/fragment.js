import glsl from 'babel-plugin-glsl/macro'

const fragmentShader =
glsl`

    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.1;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdThree(vec2(p.x -0.05, p.y));
        float right = sdOne(vec2(p.x - 0.35, p.y));
        return left + center + right;
    }
    
    float newfunc(vec2 p, float a)
    {
        p = p * 8. - 4.;
        // //p.y -= 1.25;
        p.x += 0.5;
        p.y += 0.5;
        p*= 0.5;
        // float c;
        // float d;
        // float steps = 25.;
        // for(float i = 1.; i < steps; i++)
        // {
        //     c += sdCircle(vec2(p.x  + i/ 5. * (sin(u_time * i * 0.5 * 0.2)), p.y + i / 5. * (cos(u_time * i * 0.5 * 0.2)) ), a);
        //     d += sdCircle(vec2(p.x  - i/ 5. * (sin(u_time * i * 0.5 * 0.2)), p.y - i / 5. * (cos(u_time * i * 0.5 * 0.2)) ), a);
            
        // }
        // return c + d;
        float b;
        float steps = 30.;
        for(float i = 1.; i<steps; i++)
        {
            b += sdSegment(vec2(p.x, p.y), vec2(0.25 + i/20. * (cos(u_time * i * 0.015)) , 0.25 + i/20. * (sin(u_time * i * 0.05)) ), vec2(0.75 + i/20. * (cos(u_time * i * 0.025)), 0.75 + i/20. * (sin(u_time * i * 0.05)) ));
            
        }
        return b;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        float y = newfunc(vUv, 0.25);
        color += y;
        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader