import glsl from 'babel-plugin-glsl/macro'

const numbers = 
glsl`
    float sdZero(vec2 p)
    {
        vec2 p2 = p;
        p2 *= 4.;
        vec2 p3 = p2;
        p3 = Rot(p3, PI);
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);
        float z1 = sdArc(vec2(p2.x - 2., p2.y - 2.4), vec2(a * 0.7, a * 0.7), .36, b * 0.85 );
        float z2 = sdArc(vec2(p3.x+1., p3.y+0.61), vec2(a * 0.7, a * 0.7), .36, b * 0.85 );
        z1 = 1. - smoothstep(0.01, 0.02, z1);
        z2 = 1. - smoothstep(0.01, 0.02, z2);
        float z3=sdRoundedBox((vec2(p.x+0.088, p.y)), vec2(0.082, 0.275), vec4(0.075));
        float z4=sdRoundedBox((vec2(p.x-0.088, p.y)), vec2(0.082, 0.275), vec4(0.075));
        return z1 + z2 + z3 + z4;
    }

    float sdOne(vec2 p)
    {
        p.x -= 0.15;
        vec2 vUv2 = p;
        p = p * 2. - 0.5;
        vUv2 = Rot(vUv2, PI * -0.25);
        float x1 = sdRoundedBox(vec2(p.x + 0.275, p.y), vec2(0.17, 0.85), vec4(0.1, 0.1, 0.1, 0.1));
        float x2 = sdRoundedBox(vec2(vUv2.x + 0.24, vUv2.y + 0.05), vec2(0.07, 0.2), vec4(0.1, 0.075, 0.1, 0.075));
        return x1 + x2;
    }

    float sdTwo(vec2 p)
    {
        p.x += 0.1;
        vec2 p2 = p;
        p = p * 2. - 0.5;
        vec2 p3 = p;
        p3 = p3 * 2. - 1.;
        p3.x -= 0.5;
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);
        p3 = Rot(p3, PI * 1.85);
        float x1 = sdArc(vec2(p3.x - 0.1, p3.y - 0.15), vec2(a * 0.8, a * 0.8), .35, b * 0.84 );
        x1 = smoothstep(0.01, 0.02, x1);
        p2 = Rot(p2, PI * -0.22);
        float x2 = sdRoundedBox(vec2(p2.x - 0.122, p2.y - 0.05), vec2(0.075, 0.35), vec4(0.2, 0.1, 0.1, 0.1));
        float x3 = sdRoundedBox(vec2(p.x - 0.25, p.y + 0.335), vec2(0.5, 0.155), vec4(0.1, 0.1, 0.1, 0.1));
        return 1. - x1 + x2 + x3;
    }

    float sdThree(vec2 p)
    {
        p = p * 2. - 0.5;
        p *= 1.2;
        p.y += 0.125;
        p = Rot(p, PI * -0.5);
        p = p * 2. - 1.;
        vec2 p2 = p;
        vec2 p3 = p;
        p2 = Rot(p2, PI * -0.7);
        p3 = Rot(p3, PI * -0.7 * 2.);
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);

        float x1 = sdArc(vec2(p.x, p.y), vec2(a * 0.8, a * 0.8), .45, b * 0.85 );
        float x2 = sdArc(vec2(p.x + 0.9, p.y), vec2(a * 0.8, a * 0.8), .45, b * 0.85 );
        float x3 = sdArc(vec2(p2.x - 1.2, p2.y - 0.39), vec2(a * 0.1, a * 0.1), .45, b * 0.85 );
        float x4 = sdArc(vec2(p3.x - 0.43, p3.y - 1.99), vec2(a * 0.1, a * 0.1), .45, b * 0.85 );

        x1 = 1. - smoothstep(0.01, 0.02, x1);
        x2 = 1. - smoothstep(0.01, 0.02, x2);
        x3 = 1. - smoothstep(0.01, 0.02, x3);
        x4 = 1. - smoothstep(0.01, 0.02, x4);

        return x1 + x2 + x3 + x4;
    }

    float sdFour(vec2 p)
    {
        float f1 = sdRoundedBox(vec2(p.x + 0.125, p.y - 0.09), vec2(0.07, 0.25), vec4(0.075));
        float f2 = sdRoundedBox(vec2(p.x - 0.05, p.y + 0.), vec2(0.07, 0.425), vec4(0.075));
        float f3 = sdRoundedBox(vec2(p.x + 0.00125, p.y - 0.0), vec2(0.3, 0.07), vec4(0.075));
        return f1 + f2 + f3;
    }

    float sdFive(vec2 p)
    {
        p = p * 1.05;
        p.x -= 0.05;
        p.y -= 0.02;
        float f1=sdRoundedBox((vec2(p.x+0.01, p.y-0.17)), vec2(0.275, 0.08), vec4(0.075));
        float f2=sdRoundedBox((vec2(p.x + 0.03, p.y+0.17)), vec2(0.225, 0.08), vec4(0.075));
        float f3=sdRoundedBox((vec2(p.x + 0.03, p.y+0.005)), vec2(0.245, 0.08), vec4(0.075));
        float f4=sdRoundedBox((vec2(p.x+0.112, p.y-0.09)), vec2(0.08, 0.225), vec4(0.075));
        vec2 p2 = p;
        p2 = Rot(p2, PI * -0.5);
        p2 *=4.;
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);
        float f5 = sdArc(vec2(p2.x - 2.35, p2.y - 2.09), vec2(a * 0.5, a * 0.5), .36, b * 0.85 );
        f5 = 1. - smoothstep(0.0, 0.02, f5);
        return f1 + f2 + f3 + f4 + f5;
    }

    float sdSix(vec2 p)
    {
        vec2 p2 = p;
        vec2 p4 = p2;
        p2 *= 4.;
        vec2 p3 = p2;
        p3 = Rot(p3, PI);
        // p4 = Rot(p4, PI * 0.125);
        p4 *= 4.;
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);
        float s1 = sdArc(vec2(p2.x - 2., p2.y - 1.7), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float s2 = sdArc(vec2(p3.x+1., p3.y+0.65), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float s3 = sdArc(vec2(p4.x - 1.945, p4.y - 2.35), vec2(a * 0.4, a * 0.4), .36, b * 0.82 );
        s1 = 1. - smoothstep(0.01, 0.02, s1);
        s2 = 1. - smoothstep(0.01, 0.02, s2);
        s3 = 1. - smoothstep(0.01, 0.02, s3);
        float s4=sdRoundedBox((vec2(p.x+0.092, p.y-0.035)), vec2(0.0725, 0.275), vec4(0.075));
        return s1 + s2 + s3 + s4;
    }

    float sdSeven(vec2 p)
    {
        vec2 p2 = p;
        float s1 = sdRoundedBox((vec2(p.x+0.01, p.y-0.17)), vec2(0.275, 0.08), vec4(0.075));
        p2 = Rot(p2, PI * -0.127);
        float s2 = sdRoundedBox((vec2(p2.x-0.016, p2.y+0.001)), vec2(0.08, 0.44), vec4(0.075));
        return s1 + s2;
    }

    float sdEight(vec2 p)
    {
        p *= 4.;
        vec2 p2 = p;
        p2 = Rot(p2, PI);
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);
        float e1 = sdArc(vec2(p.x - 2., p.y - 1.7), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float e2 = sdArc(vec2(p2.x+1., p2.y+0.65), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float e3 = sdArc(vec2(p.x - 2., p.y - 2.45), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float e4 = sdArc(vec2(p2.x+1., p2.y+1.5 * 0.95), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        e1 = 1. - smoothstep(0.01, 0.02, e1);
        e2 = 1. - smoothstep(0.01, 0.02, e2);
        e3 = 1. - smoothstep(0.01, 0.02, e3);
        e4 = 1. - smoothstep(0.01, 0.02, e4);
        return e1 + e2 + e3 + e4;
    }

    float sdNine(vec2 p)
    {
        p = Rot(p, PI);
        vec2 p2 = p;
        vec2 p4 = p2;
        p2 *= 4.;
        vec2 p3 = p2;
        p3 = Rot(p3, PI);
        // p4 = Rot(p4, PI * 0.125);
        p4 *= 4.;
        float a = PI * (0.5 + 0.25);
        float b = 0.2 *(0.5 + 0.5);
        float n1 = sdArc(vec2(p2.x - 2., p2.y - 1.7), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float n2 = sdArc(vec2(p3.x+1., p3.y+0.65), vec2(a * 0.72, a * 0.72), .36, b * 0.82 );
        float n3 = sdArc(vec2(p4.x - 1.945, p4.y - 2.35), vec2(a * 0.4, a * 0.4), .36, b * 0.82 );
        n1 = 1. - smoothstep(0.01, 0.02, n1);
        n2 = 1. - smoothstep(0.01, 0.02, n2);
        n3 = 1. - smoothstep(0.01, 0.02, n3);
        float n4=sdRoundedBox((vec2(p.x+0.092, p.y-0.035)), vec2(0.0725, 0.275), vec4(0.075));
        return n1 + n2 + n3 + n4;
    }
`

export default numbers