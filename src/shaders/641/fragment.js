import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numFour(vec2(p.x -0.03, p.y));
        float right = numOne(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    float random (in vec2 _st) {
        return fract(sin(dot(_st.xy,
                             vec2(12.9898,78.233)))*
            43758.5453123);
    }

    // Based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise (in vec2 _st) {
        vec2 i = floor(_st);
        vec2 f = fract(_st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    #define NUM_OCTAVES 5

    

    float fbm ( in vec2 _st) {
        float v = 0.0;
        float a = 0.65;
        vec2 shift = vec2(100.0);
        // Rotate to reduce axial bias
        mat2 rot = mat2(cos(0.5), sin(0.5),
                        -sin(0.5), cos(0.50));
        for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(_st);
            _st = rot * _st * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    vec2 getRadialUv(vec2 uv)
    {
    float angle = atan(uv.x, uv.y);
    angle = abs(angle);
    
    vec2 radialUv = vec2(0.0);
    radialUv.x = angle / (PI) + 0.5;
    radialUv.y = 1.0 - pow(1.0 - length(uv), .2);
    radialUv = vec2(0.3/length(uv) * u_time, angle );
    
    return radialUv;
    }

    vec2 position(float z) {
        return vec2(
            0.0 + sin(z * 0.1) * 1.0 + sin(cos(z * 0.031) * 4.0) * 1.0 + sin(sin(z * 0.0091) * 3.0) * 3.0,
            0.0 + cos(z * 0.1) * 1.0 + cos(cos(z * 0.031) * 4.0) * 1.0 + cos(sin(z * 0.0091) * 3.0) * 3.0
        ) * 1.0;
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
        float d2 = length(a - b);
        m *= S(1.2, .8, d2) * .5 + S(.05, .03, abs(d2-.75));
        return m;
    }

    float Layer(vec2 uv2)
    {
        float m;
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

            m += sparkle * (sin(t+fract(p[i].x) * 10.) * .5 + .5);
        }
        m += Line(gv, p[1], p[3]);
        m += Line(gv, p[1], p[5]);
        m += Line(gv, p[7], p[3]);
        m += Line(gv, p[7], p[5]);

        return m;
    }
    
    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 uv2 = vUv;
        uv2 -= .5;
        
        uv2 *= 1.5;

        float an = -u_time * 0.5;
        float r1 = length(uv2 * 1.75) ;
        float a = atan(uv2.y, uv2.x);
        a = abs(a * 1.25);
        uv2 = vec2(0.053/r1 + .95 * .25 + r1, a * 0.15);

        float m = 0.;
        float t = u_time * 0.05;
        
        for(float i =0.; i <1.; i+= 1./4.)
        {
            float z = fract(i + t);//reuse layers
            float size = mix(10., .1, z);
            float fade = S(0., 0.5, z) * S(1., 0.8, z);
            m += Layer(uv2 * size + i * 20.) * fade;
        }

        vec3 base = sin(t * vec3(.345, .456, .678)) * .4 + .6;
        vec3 col = m * base;
        // col += uv2.y * base * 0.2;
        // col -= uv2.x  * base * 0.2;
        color += col;

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

const vertexShader = glsl`
varying vec2 vUv;

void main()
{
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`

import { Vector2, ShaderMaterial } from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'

const material = new ShaderMaterial({
    vertexShader: vertexShader,

    //use for shaders <425
    //fragmentShader: fragment

    //use for shader >= 425
    //clean up the fragment shader
    //imports from preload, numbers and useful functions
    fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
    uniforms: {
        u_time: { type: "f", value: 1.0 },
        u_resolution: { type: "v2", value: new Vector2() },
        u_mouse: { type: "v2", value: new Vector2() }
    }
})

// console.log(material.fragmentShader)

export default function Shader641()
{
    const meshRef = useRef()
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
    })

    return (
        <>
            <mesh ref={meshRef} material={material} >
                <boxGeometry args={[2, 2, 0.1]} />
            </mesh>
        </>
    )
}