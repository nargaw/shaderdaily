import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdTwo(vec2(p.x -0.035, p.y));
        float right = sdNine(vec2(p.x - 0.4, p.y));
        return left + center + right;
    }

    #define S(a, b, t) smoothstep(a, b, t)

    float DistLine(vec2 p, vec2 a, vec2 b)
    {
        vec2 pa = p - a;
        vec2 ba = b - a;
        float t = clamp(dot(pa, ba)/ dot(ba, ba), 0., 1.);
        return length(pa - ba * t);
    }

    float N21(vec2 p)
    {
        p = fract(p * vec2(445.23, 789.92));
        p += dot(p, p + 54.23 );
        return fract(p.x * p.y);
    }

    vec2 N22(vec2 p)
    {
        float n = N21(p);
        return vec2(n, N21(p + n));
    }

    vec2 GetPos(vec2 id, vec2 offset)
    {
        vec2 n = N22(id+offset) * u_time;
        // float x = sin(u_time* n.x);
        // float y = cos(u_time*n.y);
        return offset + sin(n) * .4;
    }

    float Line(vec2 p, vec2 a, vec2 b)
    {
        float d = DistLine(p, a, b);
        float m = S(.03, 0.01, d);
        m *= S(1.2, .8, length(a -b));
        return m;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 uv2 = vUv;
        uv2 -= 0.5;
        
        // float d = DistLine(uv2, vec2(0.), vec2(1.));
        float m = 0.;
        
        uv2 *= 8.;
        vec2 gv = fract(uv2) - 0.5;
        vec2 id = floor(uv2);

        // vec2 p = N22(id) - 0.5;

        vec2 p[9];

        // vec2 p = GetPos(id);
        // float d = length(gv - p);
        // m = S(0.1, 0.05, d);


        int i = 0;
        for(float y=-1.; y <=1.; y++)
        {
            for(float x=-1.; x<=1.; x++)
            {
                p[i++]= GetPos(id, vec2(x, y));
            }
        }

        float t = u_time * 10.;

        for(int i=0; i < 9; i++)
        {
            m += Line(gv, p[4], p[i]);
            
            vec2 j = (p[i] - gv) * 40.;
            float sparkle = 1. / dot(j, j);

            m += sparkle * (sin(t+p[i].x * 10.) * .5 + .5);
        }
        m += Line(gv, p[1], p[3]);
        m += Line(gv, p[1], p[5]);
        m += Line(gv, p[7], p[3]);
        m += Line(gv, p[7], p[5]);

        vec3 col = vec3(m);
        // col.rg = gv;

        // color.rg = col.rg;

        // color += m;
        // if(gv.x > .48 || gv.y > .48) col = vec3(1., 0, 0);
        color += col;

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader