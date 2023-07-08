import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numFive(vec2(p.x + 0.35, p.y));
        float center = numSeven(vec2(p.x -0.03, p.y));
        float right = numNine(vec2(p.x - 0.42, p.y));
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
    
    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 uv2 = vUv;
        uv2 -= .5;
        // uv2 = getRadialUv(uv2 );

        float an = -u_time * 0.5;
        // uv2 = mat2(cos(an),-sin(an),sin(an),cos(an)) * uv2;
        // uv3 = mat2(cos(an),-sin(an),sin(an),cos(an)) * uv3;
        float r1 = length(uv2 * .75) ;
        // r1 = abs(r1 );
        float a = atan(uv2.y, uv2.x);
        a = abs(a * 1.5);
        uv2 = vec2(0.53/r1 + .95 + u_time * 1.25 + r1 + sin(u_time), a );

        // uv2 = vec2(position(uv2.x) * position(uv2.y));

        vec2 q = vec2(0.);
        q.x = fbm( uv2 + 0.2*u_time);
        q.y = fbm( uv2 + u_time * 0.4);

        vec2 r = vec2(0.);
        r.x = fbm( uv2 + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
        r.y = fbm( uv2 + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

        float f = fbm(uv2+r * fbm(uv2 + r * 2.));

        vec3 c = vec3(0.);
        c = mix(vec3(0.91961,0.919608,0.966667),
                    vec3(0.06667,0.666667,0.998039),
                    clamp((f*f)*2.0,0.0,1.0));

        c *= mix(color,
                    vec3(0.299,0.50,0.964706),
                    clamp(length(q),0.,1.0));

        c *= mix(color,
                    vec3(0.996667,0.9,0.),
                clamp(length(r.y),0.0,1.0));

        c += mix(color,
            vec3(0.95,0.95,1.),
        clamp(length(r.x),0.0, .25));

        c *= f * f * 2.;

        float cir = sdCircle(vUv, 0.125 ) * 0.65;
        

        color += c * 2. ;
        color *=  c - cir;

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

console.log(material.fragmentShader)

export default function Shader579()
{
    const meshRef = useRef()
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
    })

    return (
        <>
            <mesh ref={meshRef} material={material}>
                <planeGeometry args={[1, 1, 1, 1]} />
            </mesh>
        </>
    )
}