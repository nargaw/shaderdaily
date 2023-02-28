import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdOne(vec2(p.x -0.035, p.y));
        float right = sdEight(vec2(p.x - 0.4, p.y));
        return left + center + right;
    }

    // 2D Random
    float random (in vec2 st) {
        return fract(sin(dot(st.xy,
                            vec2(12.9898,78.233)))
                    * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Smooth Interpolation

        // Cubic Hermine Curve.  Same as SmoothStep()
        vec2 u = f*f*(3.0-2.0*f);
        // u = smoothstep(0.,1.,f);

        // Mix 4 coorners percentages
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
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
        uv2 = uv2 *2. - .5;
        // uv2.y -= .2;
        vec2 uv3 = uv2;
        // uv2 = Rot(uv2, u_time * 0.75);
        // uv3 = Rot(uv3, u_time * 0.5 + PI * 0.25);

        for (int i=1; i<5; i++)
        {
            for(int j=1; j<=4; j++)
            {
                
                vec2 newUv = uv2;
                
                uv2 = Rot(uv2, (sin(u_time * .175)/6. + 11.0));
                uv2 = (noise(uv2) * 0.15) + uv2;
                shape1 += sdSegment(vec2(uv2.x , uv2.y), vec2(0.0), vec2(0.05 * float(i) + cos(u_time), 0.05 / float(i) + cos(u_time)));
                shape2 += sdSegment(vec2(uv2.x , uv2.y), vec2(0.0), vec2(0.05 * float(i) + sin(u_time), 0.05 / float(i) + sin(u_time)));
                

            }
        }
       
        
        
        // shape1 += box;
        // shape2 += box2;

        float z = circle(uv3, 2.);
        
        color += shape1; 
        color += shape2;
        color *= z;
        // color += shape3; 
        // color += shape4;  
        
        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader