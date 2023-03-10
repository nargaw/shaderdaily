import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdTwo(vec2(p.x -0.035, p.y));
        float right = sdEight(vec2(p.x - 0.4, p.y));
        return left + center + right;
    }

    // 2D Random
    float random (in vec2 st) {
        return fract(sin(dot(st.xy,
                            vec2(12.9898,78.233)))
                    * 43758.5453123);
    }

    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
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
        
        vec2 uv2 = vUv;

        uv2 *= 4.;

        vec2 iUv = floor(uv2);
        vec2 fUv = fract(uv2);

        float m_dist = 1.;
        float seg;
        float shape;

        for(int y = -2; y <=2; y++){
            for(int x = -2; x <=2; x++){
                vec2 n = vec2(float(x), float(y));
                vec2 p = random2(iUv + n);
                p = 0.25 + 0.25 * sin(u_time + TWO_PI * p );
                vec2 dif = n + p - fUv;
                float dist = length(dif);
                m_dist = min(m_dist, dist);
                shape = min(m_dist, dist);
                // m_dist = smoothstep(0.05, 0.051, m_dist);
                
                seg = sdSegment(p, vec2(m_dist /dist), vec2(m_dist));
                color += seg;
            }
        }
        
        // color += shape;
        // color += smoothstep(0.9, 0.11, shape);
        // color += 1. - m_dist;
        

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader