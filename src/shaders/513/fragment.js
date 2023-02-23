import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdOne(vec2(p.x -0.035, p.y));
        float right = sdThree(vec2(p.x - 0.4, p.y));
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
        
        
        // uv2.x += 1.;
        // uv2.y -0.2;
        // uv2 = Rot(uv2, 0.15 * u_time);
        uv2 = uv2 *4. - 1.5;
        // uv2.y -= .2;
        vec2 uv3 = uv2;
        // uv2 = Rot(uv2, u_time * 0.75);
        // uv3 = Rot(uv3, u_time * 0.5 + PI * 0.25);

        for (int i=1; i<15; i++)
        {
            for(int j=1; j<=10; j++)
            {
                
                vec2 newUv = uv2;
                // newUv = Rot(vec2(newUv.x + float(i /2) * 0.085, newUv.y + float(j) * .085), sin(u_time + 0.05 * float(j * i)/2.) + 0.53*1.);
                // float line = sdSegment(vec2(newUv.x , newUv.y ), vec2(0.0), vec2(0.5 + sin(u_time * 0.125)/5.));
                // float line = sdPolygonOutline(vec2(newUv.x , newUv.y ), int(3), float(0.5 + sin(u_time * 0.125)/5.));
                // float r = rect(vec2(newUv), 0.45, 3.);
                // float c = sdCircleOutline(vec2(newUv), float(i - j) * sin(u_time)/2. + 1.);
                // shape1 += c;
                // shape1 += rectOutline(vec2(newUv), 0.15, 0.15);
                // for (int i=0; i<=10; i++)
                
            // uv2 = uv2 * 1.1 - 0.1;
                uv2 = Rot(uv2, sin(u_time * 0.00115 * float(i)));
                shape1 += circle(vec2(uv2.x + sin(float(i - j)/30. + (u_time * 0.25)) * 2. , uv2.y), 0.00525);
                shape2 += circle(vec2(uv2.x  , uv2.y + cos(float(i - j) + (u_time * 0.5))), 0.00525);
                shape3 += circle(vec2(uv2.x + sin(float(j -i  ) + (u_time * 0.5)), uv2.y + cos(float(j * i) + (u_time * 0.5))), 0.00525);
                shape4 += circle(vec2(uv2.x - sin(float(j * i) +(u_time * 0.5)), uv2.y + cos(float(j * i) + (u_time * 0.5))), 0.00525);
            // uv2 = Rot(uv2, u_time * 0.25 * float(i)/5.);
            
        
                // shape2 += rectOutline(vec2(uv3), 0.5, 0.5);
            }
        }
       
        
        
        // shape1 += box;
        // shape2 += box2;

        float z = circle(uv3, 0.95);
        
        color += shape1; 
        // color += shape2;
        // color *= z;
        // color += shape3; 
        // color += shape4;  
        
        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader