import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdNine(vec2(p.x -0.035, p.y));
        float right = sdOne(vec2(p.x - 0.4, p.y));
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
        // uv2 = Rot(uv2, PI * 0.5);
        uv2 = uv2 *4. - 1.5;
        // uv2.x -= 1.;
        uv2 = Rot(uv2, u_time * 0.5);
        for (int i=1; i<=40; i++)
        {
            // uv2 = uv2 * 1.1 - 0.1;
            uv2 = Rot(uv2, ((u_time * 0.5) * float(i/25))/200825.);
            // shape1 += rectOutline(vec2(uv2.x + sin(u_time*(float(i)/25.)) * sin(u_time), uv2.y + cos(u_time*(float(i)/25.)) * sin(u_time)), 0.25, 0.25);
            shape2 += rectOutline(vec2(uv2.x + cos(u_time*(float(i)/5.)) + abs(cos(u_time * 0.5)), uv2.y + sin(u_time*(float(i)/5.)) * abs(sin(u_time * 0.5))), 0.0525, 0.0525);
            shape3 += rectOutline(vec2(uv2.x + (sin(u_time*(float(i)/5.))) - (sin(u_time * 0.5)), uv2.y + cos(u_time*(float(i)/5.)) * abs(cos(u_time * 0.5))), 0.0525, 0.0525);
            // shape4 += rectOutline(vec2(uv2.x + cos(u_time*(float(i)/25.)) * cos(u_time), uv2.y + sin(u_time*(float(i)/25.)) * cos(u_time)), 0.05, 0.05);
            
        }
        
        color += shape1; 
        color += shape2;
        color += shape3; 
        color += shape4;  
        
        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader