import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdSeven(vec2(p.x -0.035, p.y));
        float right = sdEight(vec2(p.x - 0.39, p.y));
        return left + center + right;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        float shape1;
        float shape2;
        float shape3;
        float shape4;
        vec2 newvUv = vUv;
        // newvUv = Rot(newvUv, u_time * .25);
        newvUv = newvUv * 4. - 1.5;
        float k = 1. + 20. * (0.25 - 0.125);
        
        for (int i=0; i<=13; i++)
        {
            shape1 += circle(vec2(newvUv.x + sin(u_time * float(i) * 0.1 + 0.5), newvUv.y +  float(i) * 0.1), 0.15 * (sin(float(i) * u_time * 0.1))+0.15);
            shape2 += circle(vec2(newvUv.x + sin(u_time * float(i) * 0.1 + 0.5) , newvUv.y -  float(i) * 0.1), 0.15 * (sin(float(i) * u_time * 0.1))+0.15);
            shape3 += cirOutline(vec2(newvUv.x + sin(u_time * float(i) * 0.1 + 0.5), newvUv.y +  float(i) * 0.1), 0.15 * (sin(float(i) * u_time * 0.1))+0.15);
            shape4 += cirOutline(vec2(newvUv.x + sin(u_time * float(i) * 0.1 + 0.5) , newvUv.y -  float(i) * 0.1), 0.15 * (sin(float(i) * u_time * 0.1))+0.15);
        }
        
        color += shape1 * shape3;
        // shape2 = rect(vec2(vUv.x, vUv.y), 1., 0.01);
        // shape3 = rect(vec2(vUv.x, vUv.y), 0.01, 1.);
        color += shape2 * shape4;
        // color *= shape3;
        // color += shape4;
        

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader