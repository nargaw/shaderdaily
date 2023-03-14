import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdThree(vec2(p.x -0.035, p.y));
        float right = sdTwo(vec2(p.x - 0.35, p.y));
        return left + center + right;
    }

    #define MAX_STEPS 100
    #define MAX_DIST 100.
    #define SURF_DIST .01

    float sdCapsule(vec3 p, vec3 a, vec3 b, float r)
    {
        vec3 ab = b-a;
        vec3 ap = p-a;

        float t = dot(ab, ap)/dot(ab, ab);
        t = clamp(t, 0., 1.);

        vec3 c = a + t * ab;
        return length(p - c) - r;
    }

    float sdCylinder(vec3 p, vec3 a, vec3 b, float r)
    {
        vec3 ab = b-a;
        vec3 ap = p-a;

        float t = dot(ab, ap)/dot(ab, ab);
        // t = clamp(t, 0., 1.); //infinite

        vec3 c = a + t * ab;
        float x = length(p - c) - r;
        float y = (abs(t - .5) - .5) * length(ab);
        float e = length(max(vec2(x,y), 0.));
        float i = min(max(x, y), 0.);

        return e + i;
    }


    float sdTorus(vec3 p, vec2 r)
    {
        float x = length(p.xz) - r.x;
        return length(vec2(x, p.y)) - r.y;
    }

    float sdBox(vec3 p, vec3 s)
    {
        return length(max(abs(p) - s, 0.));
    }

    float GetDist(vec3 p)
    {
        vec4 s = vec4(0, 1, 6, 1);
        float sphereDist = length(p -s.xyz) - s.w;
        float planeDist = p.y;

        float cd = sdCapsule(p, vec3(0, 1, 6), vec3(1, 2, 6), 0.2);
        float td = sdTorus(p-vec3(0, .5, 6), vec2(1., 0.3));
        float bd = sdBox(p - vec3(-3, .75, 6), vec3(.5));
        float cyld = sdCylinder(p, vec3(0, .3, 3), vec3(3, 1, 6), 0.2);

        // float d = min(sphereDist, planeDist);
        float d = min(cd, planeDist);
        d = min(d, td);
        d = min(d, bd);
        d = min(d, cyld);
        return d;
    }

    float RayMarch(vec3 ro, vec3 rd)
    {
        float dO=0.;

        for(int i=0; i <MAX_STEPS; i++)
        {
            vec3 p = ro + rd * dO;
            float dS = GetDist(p);
            dO += dS;
            if(dO>MAX_DIST || dS<SURF_DIST) break;
        }
        return dO;
    }
    
    vec3 GetNormal(vec3 p)
    {
        float d = GetDist(p);
        vec2 e = vec2(0.01, 0);
        vec3 n = d - vec3(
            GetDist(p-e.xyy),
            GetDist(p-e.yxy),
            GetDist(p-e.yyx)
        );
        return normalize(n);
    }

    float GetLight(vec3 p)
    {
        vec3 lightPos = vec3(0, 5, 6);
        lightPos.xz += vec2(sin(u_time), cos(u_time)) * 2.;
        vec3 l = normalize(lightPos - p);
        vec3 n = GetNormal(p);

        float dif = clamp(dot(n, l), 0., 1.);

        float d = RayMarch(p + n * SURF_DIST * 2., l);
        if(d < length(lightPos -p)) dif *= .1;

        return dif;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 uv2 = vUv;
        uv2 -= 0.5;

        vec3 ro = vec3(sin(u_time), 3, -2.-cos(u_time));//camera
        vec3 rd = normalize(vec3(uv2.x, uv2.y - .2, 1));//ray direction

        float d = RayMarch(ro, rd);

        vec3 p = ro + rd * d;

        float dif = GetLight(p);
        color  = vec3(dif);

        // d /= 6.;
        // color = vec3(d);

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader