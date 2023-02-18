import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdZero(vec2(p.x -0.035, p.y));
        float right = sdEight(vec2(p.x - 0.4, p.y));
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
        vec2 uv2 = vUv;
        
        vec2 uv3 = vUv;
        // uv2.x += 1.;
        // uv2.y -0.2;
        // uv2 = Rot(uv2, 0.15 * u_time);
        uv2 = uv2 *15. - 15.;
        // uv2.x -= 1.;
        // uv2 = Rot(uv2, u_time * 0.15);
        
        for (int i=1; i<=15; i++)
        {
            for(int j=1; j<=15; j++)
            {
                
                vec2 newUv = uv2;
                newUv = Rot(vec2(newUv.x + float(i) * 1.5, newUv.y + float(j) * 1.5), cos(u_time + 0.08 * float(j * i)/5.) + 0.53*1.9);
                // float line = sdSegment(vec2(newUv.x , newUv.y ), vec2(0.0), vec2(0.5 + sin(u_time * 0.125)/5.));
                // float line = sdPolygonOutline(vec2(newUv.x , newUv.y ), int(3), float(0.5 + sin(u_time * 0.125)/5.));
                // float r = rect(vec2(newUv), 0.45, 3.);
                float c = sdCircleOutline(vec2(newUv), float(i - j) * sin(u_time)/2. + 1.);
                shape1 += c;
            }
        }

        float z = circle(uv3, 0.95);
        
        color += shape1; 
        // color *= shape2;
        // color *= z;
        // color += shape3; 
        // color += shape4;  
        
        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader