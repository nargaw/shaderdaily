import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdSix(vec2(p.x -0.035, p.y));
        float right = sdZero(vec2(p.x - 0.39, p.y));
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
        
        float n = noise(vUv * (u_time + 82. * 1.2)/15.);
        vec2 noiseUv = vUv;
        noiseUv = noiseUv * 4. - 2.;
        // noiseUv.y += 2.;
        noiseUv = noiseUv * n;
        vec2 newUv = vUv;
        newUv = Rot(newUv, u_time * 0.25);
        float shape = rect(newUv, 0.5 + n/5. * sin(u_time), 0.5 + n/5. * cos(u_time));
        float shape2 = circle(vUv * 2. - 0.5, 0.5 + n/5. * sin(u_time));
        float shape3 = circle(vUv * 2.5 - 0.75, 0.5 + n/5. * sin(u_time));        color += shape;
        color += shape2;
        color -= shape3;
        float shape4 = rect(newUv, 0.45 + n/5. * sin(u_time), 0.45 + n/5. * cos(u_time));
        color -= shape4;
        

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader