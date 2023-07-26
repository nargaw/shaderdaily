import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdThree(vec2(p.x -0.035, p.y));
        float right = sdOne(vec2(p.x - 0.4, p.y));
        return left + center + right;
    }

    #define MAX_STEPS 100
    #define MAX_DIST 100.
    #define SURF_DIST .01

    float GetDist(vec3 p)
    {
        vec4 s = vec4(0, 1, 6, 1);
        float sphereDist = length(p -s.xyz) - s.w;
        float planeDist = p.y;

        float d = min(sphereDist, planeDist);
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

        vec3 ro = vec3(0, 1, 0);//camera
        vec3 rd = normalize(vec3(uv2.x, uv2.y, 1));//ray direction

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

export default function Shader531()
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