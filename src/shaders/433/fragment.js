import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.1;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdThree(vec2(p.x -0.05, p.y));
        float right = sdThree(vec2(p.x - 0.35, p.y));
        return left + center + right;
    }

    float newfunc(vec2 p, float a)
    {
        p = p * 12. - 6.;
        // //p.y -= 1.25;
        p.x += 1.;
        p.y += 1.;
        p*= 0.5;
        float b;
        float steps = 25.;
        for(float i = 1.; i<steps; i++)
        {
            // p = p * sin(u_time);
            b += sdCircleOutline(vec2(p.x + i / 10. * sin(u_time + i / 5. ), p.y + i / 10. * cos(u_time + i / 10.)), a);
            b += sdCircleOutline(vec2(p.x - i / 10. * sin(u_time + i / 5. ), p.y + i / 10. * cos(u_time + i / 10.)), a);
            b += sdCircleOutline(vec2(p.x + i / 10. * cos(u_time + i / 5. ), p.y + i / 10. * sin(u_time + i / 10.)), a);
            b += sdCircleOutline(vec2(p.x - i / 10. * cos(u_time + i / 5. ), p.y + i / 10. * sin(u_time + i / 10.)), a);
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