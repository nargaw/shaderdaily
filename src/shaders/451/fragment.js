import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdFive(vec2(p.x -0.035, p.y));
        float right = sdOne(vec2(p.x - 0.39, p.y));
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
        
        float n = noise(vUv);
        vec2 noiseUv = vUv;
        noiseUv = noiseUv * 4. - 2.;
        noiseUv.y += 2.;
        noiseUv = noiseUv * n;
        vec2 newUv = vUv;
        newUv = newUv / 1.25 + 0.1;
        float box = sdRoundedBox(newUv, vec2(0.5), vec4(
            0.25 * n + (sin(u_time + abs(sin(n * u_time * 0.5) + 125.0)/2.) / 2.) + 0.2, 
            0.25 * n + (sin(u_time + abs(sin(n * u_time * 0.5) + 125.0)/2.) / 2.) + 0.2, 
            0.25 * n + (sin(u_time + abs(sin(n * u_time * 0.5) + 125.0)/2.) / 2.) + 0.2, 
            0.25 * n + (sin(u_time + abs(sin(n * u_time * 0.5) + 125.0)/2.) / 2.) + 0.2));
        float y = (sin(noiseUv.x + u_time) )  / 2. ;
        float line = plot(vec2(noiseUv.x, noiseUv.y - 0.5), y, 0.01);
        float line2 = plot(vec2(noiseUv.x, noiseUv.y - 0.5), y * n, 0.01);
        float line3 = plot(vec2(noiseUv.x, noiseUv.y - 0.5), y * n * n, 0.01);
        // color += line;
        // color += line2;
        // color += line3;
        color += box;

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader