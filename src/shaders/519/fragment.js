import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdOne(vec2(p.x -0.035, p.y));
        float right = sdNine(vec2(p.x - 0.4, p.y));
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

    float semi (vec2 p, float n)
    {
        float c = circle(vec2(p), n);
        float c2 = circle(vec2(p), n + n * 0.05);
        float r = rect(vec2(p.x, p.y- n * 0.45), n - n * 0.1, n + n * 0.5);
        float r2= rect(vec2(p.x, p.y -0.2), n, n * 0.3);
        float shape = r * c * 2.;
        float shape2 = r2 * c2* 2.;
        return shape;
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
        
        uv2 = uv2 *2. - .5;


        for(int i = 1; i < 20; i++)
        {
            uv2 = Rot(uv2, ((u_time * .175)/1. + 1.0));
            vec2 newUv = uv2;
            shape1 += semi(newUv, float(i)/10. + 0.5);
            shape2 -= semi(newUv, float(i)/10. + 0.45);
        }
        
        
        color += shape1; 
        color += shape2;
        
        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader