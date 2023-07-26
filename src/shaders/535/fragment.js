import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = sdFive(vec2(p.x + 0.35, p.y));
        float center = sdThree(vec2(p.x -0.035, p.y));
        float right = sdFive(vec2(p.x - 0.35, p.y));
        return left + center + right;
    }

    // mat3 rotateY(float theta) {
    //     float c = cos(theta);
    //     float s = sin(theta);
    //     return mat3(
    //         vec3(c, 0, s),
    //         vec3(0, 1, 0),
    //         vec3(-s, 0, c)
    //     );
    // }

    vec3 rotateY(vec3 p, float a)
    {

        float c = cos(a);
        float s = sin(a);
        p = mat3(
            vec3(c, 0, s),
            vec3(0, 1, 0),
            vec3(-s, 0, c)
        ) * p ;
        
        return p ;
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
        p.x += sin(u_time);
        float x = length(p.xz) - r.x;
        return length(vec2(x, p.y)) - r.y;
    }

    mat3 identity() {
        return mat3(
            vec3(1, 0, 0),
            vec3(0, 1, 0),
            vec3(0, 0, 1)
        );
    }

    float sdBox(vec3 p, vec3 s)
    {
        return length(max(abs(p) - s, 0.));
    }



    float GetDist(vec3 p)
    {
        
        vec3 p2 = vec3(p);
        // p2 = rotateY(p2, sin(u_time)*0.5);
        // mat3 i = identity(p2);
        vec4 s = vec4(0, 1, 6, 1);
        float sphereDist = length(p -s.xyz) - s.w;
        float planeDist = p2.y;


        

        float cd = sdCapsule(p, vec3(0, 1, 6), vec3(1, 2, 6), 0.2);
        float td = sdTorus(p-vec3(0, 1.5, 6), vec2(1., 0.3));
        float bd = sdBox(p2 - vec3(0, 2.75 + sin(u_time), 6.), vec3(.5));
        float bd2 = sdBox(p2 - vec3(-2. + sin(u_time), 2.75, 6.), vec3(.5));
        float bd3 = sdBox(p2 - vec3(2. + sin(u_time), 2.75, 6.), vec3(.5));
        float cyld = sdCylinder(p2, vec3(0.  + sin(u_time) * 2., .3 , 3), vec3(3, 1. , 6), 0.2);

        float d = min(bd, planeDist);
        // float d = min(bd, planeDist);
        d = min(bd, d);
        d = min(bd2, d);
        d = min(bd3, d);
        d = min(cyld, d);
        // d = min(d, cyld);
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
        vec3 lightPos = vec3(2, 15, 3);
        // lightPos.xz += vec2(sin(u_time), cos(u_time)) * 4.;
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

        vec3 ro = vec3(-1, 5., -6.);//camera
        
        vec3 rd = normalize(vec3(uv2.x, uv2.y - .2 , 1));//ray direction
        
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

export default function Shader535()
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