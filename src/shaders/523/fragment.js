import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdTwo(vec2(p.x -0.035, p.y));
        float right = sdThree(vec2(p.x - 0.4, p.y));
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

    vec3 voronoi(vec2 x)
    {
        vec2 n=floor(x);
        vec2 f=fract(x);
    
        vec2 mg,mr;
        float md=1.;
        
        for(int i=-1;i<=1;i++){
            for(int j=-1;j<=1;j++){
                vec2 g=vec2(float(j),float(i));
                vec2 o=random2(n+g);
                o=.5+.5*sin((u_time * 0.75)+TWO_PI*o);
                
                vec2 r=g+o-f;
                float d=dot(r,r);
                
                if(d<md){
                    md=d;
                    mr=r;
                    mg=g;
                }
                
            }
        }
        md=0.5;
        for(int i=-5;i<=5;i++){
            for(int j=-5;j<=5;j++){
                vec2 g=vec2(float(j),float(i));
                vec2 o=random2(n+g);
                o=.5+.5*sin((u_time * 0.75)+TWO_PI*o);
                
                vec2 r=g+o-f;
                if(dot(mr-r,mr-r)>.001){
                    md=min(md,dot(.25*(mr+r),normalize(r-mr)));
                    
                }
            }
        }
        return vec3(md, mr);
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        
        vec2 uv2 = vUv;

        uv2 *= 5.;

        vec2 iUv = floor(uv2);
        vec2 fUv = fract(uv2);

        float m_dist = 50.;
        float seg;
        float shape;

        vec3 s = voronoi(uv2);
        float dd = length(s.yz);

        color+=mix(vec3(1.), color, smoothstep(0.002, 0.05, dd * s.x));
        // color += 1. - smoothstep(0.01, 0.012, s.x);
        

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

export default function Shader523()
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