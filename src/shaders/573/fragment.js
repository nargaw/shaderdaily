import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numFive(vec2(p.x + 0.35, p.y));
        float center = numSeven(vec2(p.x -0.03, p.y));
        float right = numThree(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    //https://iquilezles.org/articles/palettes/
    vec3 palette( float t ) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(.9, .5, .0);
        vec3 d = vec3(0.03,0.06,0.);

        return a + b*cos( 6.28318*(c*t+d) );
    }

    float variation(vec2 v1, vec2 v2, float strength, float speed) {
        return sin(
            dot(normalize(v1), normalize(v2)) * strength + u_time * speed
        ) / 100.0;
    }
    
    vec3 paintCircle (vec2 uv, vec2 center, float rad, float width) {
        
        vec2 diff = center-uv;
        float len = length(diff);
    
        len += variation(diff, vec2(0.0, 1.0), 5.0, 2.0);
        len -= variation(diff, vec2(1.0, 0.0), 5.0, 2.0);
        
        float circle = smoothstep(rad-width, rad, len) - smoothstep(rad, rad+width, len);

        float segment = sdSegment(uv, vec2(0.), vec2(0.5));

        return vec3(circle);
    }
    
    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 uv2 = vUv;
        // uv2 = Rot(uv2, u_time * 0.25);
        float m = 0.;
        vec3 d;
        uv2 -= 0.5;
        float t = u_time * 0.05;
        for(float i =0.; i <1.; i+= 1./2.)
        {
            float z = fract(i + t);//reuse layers
            float size = mix(.5, .05, z);
            float fade = S(0.0, 0.5, z) * S(.0, 1., z) ;
            
            
            vec3 cir = paintCircle(uv2 , vec2(0.0) ,  fade  + 0.15 * 1.25 , 0.01 );
            vec3 cir2 = paintCircle(uv2, vec2(0.0) ,  fade + 0.15 * 1.25, 0.04 );

            vec3 cir3 = paintCircle(uv2, vec2(0.0) ,  fade + 0.1 * 1.25, 0.01);
            vec3 cir4 = paintCircle(uv2, vec2(0.0) ,  fade + 0.1 * 1.25, 0.04);

            vec3 cir5 = paintCircle(uv2, vec2(0.0) ,  fade + 0.05 * 1.25, 0.01);
            vec3 cir6 = paintCircle(uv2, vec2(0.0) ,  fade + 0.05 * 1.25, 0.04 );

            vec3 cir7 = paintCircle(uv2, vec2(0.0) ,  fade - 0.0 * 1.25, 0.01);
            vec3 cir8 = paintCircle(uv2, vec2(0.0) ,  fade - 0.0 * 1.25, 0.04);

            vec3 cir9 = paintCircle(uv2, vec2(0.0) ,  fade - 0.05 * 1.25, 0.01);
            vec3 cir10 = paintCircle(uv2, vec2(0.0) ,  fade - 0.05 * 1.25, 0.04);

            vec3 cir11 = paintCircle(uv2, vec2(0.0) , fade - 0.1 * 1.25, 0.01);
            vec3 cir12 = paintCircle(uv2, vec2(0.0) , fade - 0.1 * 1.25, 0.04);

            vec3 cir13 = paintCircle(uv2, vec2(0.0) , fade - 0.15  * 1.25, 0.01 );
            vec3 cir14 = paintCircle(uv2, vec2(0.0) ,  fade - 0.15 * 1.25, 0.04);

            cir += cir2;
            color += cir2 * vec3(0.9, 0., 0.);
            // m += Layer(uv2 * size + i * 20.) * fade;

            cir3 += cir4;
            color += cir4 * vec3(0.9, 0.5, 0.0);

            cir5 += cir6;
            color += cir6 * vec3(1., 1., 0.0);

            cir7 += cir8;
            color += cir8 * vec3(0., 1., 0.0);

            cir9 += cir10;
            color += cir10 * vec3(0., 0., 1.0);

            cir11 += cir12;
            color += cir12 * vec3(0.29, 0., 0.51);

            cir13 += cir14;
            color += cir14 * vec3(0.93, 0.51, 0.93);
        }
        
        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader