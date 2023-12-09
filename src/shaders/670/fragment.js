import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numSeven(vec2(p.x -0.03, p.y));
        float right = numZero(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    uniform vec3 u_Color1;
    uniform vec3 u_Color2;

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv * 5.0 - 2.5;
        // uv2 -= 0.5;

        vec2 m = u_mouse.xy;
        vec3 color = vec3(0.);
        float n = noise2D(uv2 + (u_time));
        uv2 += n;
        // color = vec3(vUv, 0.);
        color = mix(
            u_Color1,
            u_Color2,
            uv2.x + n + n
        );

        //mix
        //mix(a, b, t) - linearly interpolate between a & b using t as a percentage

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
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'
import * as THREE from 'three'
import { folder, useControls } from 'leva'

export default function Shader670()
{
    const r = './Models/EnvMaps/1/';
    const urls = [ r + 'px.png', r + 'nx.png',
    r + 'py.png', r + 'ny.png',
    r + 'pz.png', r + 'nz.png' ];

    const textureCube = new THREE.CubeTextureLoader().load(urls)

    const { x, y, z} = useControls('Color1',{
        x: {
            value: 0.24,
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Color1.x',
            
        },
        y: {
            value: 0.21,
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Color1.y'
        },
        z: {
            value: 0.35,
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Color1.z'
        }
    })

    const { x2, y2, z2} = useControls('Color2',{
        x2: {
            value: 0.76,
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Color2.x'
        },
        y2: {
            value: 0.48,
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Color2.y'
        },
        z2: {
            value: 0.49,
            min: 0.0,
            max: 1.0,
            step: 0.01,
            label: 'Color2.z'
        }
    })

    const material = new ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(1, 1) },
            u_mouse: { type: "v2", value: new Vector2() },
            u_cubemap: { value: textureCube},
            u_Color1: { value: new THREE.Vector3(x, y, z)},
            u_Color2: { value: new THREE.Vector3(x2, y2, z2)}
        }
    })


    const meshRef = useRef()

    let mouseX;
    let mouseY;
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
        meshRef.current.material.uniforms.u_mouse.value = new Vector2(mouseX, mouseY)
        // console.log(clock.elapsedTime)
    })

    addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth);
        mouseY = -(e.clientY / window.innerHeight) + 1;
    })

    addEventListener('contextmenu', e => e.preventDefault())

    addEventListener('touchmove', (e) => {
        mouseX = (e.changedTouches[0].clientX / window.innerWidth);
        mouseY = -(e.changedTouches[0].clientY / window.innerHeight) + 1;
    }, {passive: false})

    return (
        <>
            <mesh dispose={null} ref={meshRef} material={material} >
                <boxGeometry args={[2., 2., 0.1]} />
            </mesh>
        </>
    )
}