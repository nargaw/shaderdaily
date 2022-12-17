import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = 
glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFour(vec2(p.x + 0.3, p.y));
        float center = sdFour(vec2(p.x -0.05, p.y));
        float right = sdSix(vec2(p.x - 0.38, p.y));
        return left + center + right;
    }

    float newfunc(vec2 p, float a)
    {
        p = Rot(p , u_time);
        p = p * 2. - 1.;
        // //p.y -= 1.25;
        // p.x += 1.;
        // p.y += 1.;
        // p*= 0.5;
        float b;
        float steps = 15.;
        
        for(float i = 1.; i<steps; i++)
        {
            // p = Rot(p, u_time * 0.25);
            // p = p * 2. - 1.;
            float k = 1. + i * (0.25 - 0.25 * cos(u_time * i * 0.025));
            b += sdSpiral(p , a  * i, k + i * 0.2);
        }
        return b;
    }
    

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        
        vec3 color = vec3(0.);
        float numLabel = label(vUv);

        // vUv = vUv * 2. - 1.;
        float k = 1. + 20. * (0.5 - 0.5 * cos(u_time + 1.5));
        float spiral = sdSpiral(vUv, 1.0, k);
        // color += spiral;
        float func = newfunc(vUv, 1.0);
        // color.g += func * 0.25;
        color.r += func * 0.25 - abs(cos(u_time * 0.5));
        color.b += func * 0.25 - (sin(u_time * 0.5)  /2.) - 0.5;
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

export default fragmentShader