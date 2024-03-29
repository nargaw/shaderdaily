import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    #define grid 10.
    #define time u_time
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numSeven(vec2(p.x -0.03, p.y));
        float right = numEight(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    //inverseLerp 
    float inverseLerp(float v, float minVal, float maxVal){
        return (v - minVal) / (maxVal - minVal);
    }

    //remap
    float remap(float v, float minIn, float maxIn, float minOut, float maxOut){
        float t = inverseLerp(v, minIn, maxIn);
        return mix(minOut, maxOut, t);
    }



    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
        vec3 color = vec3(0.);
        // uv2 -= 0.5;

        vec3 green = vec3(0., 1., 0.);
        vec3 cyan = vec3(0., 1., 1.);

        float value1 = uv2.x * (1.0 - uv2.x) * 4. * abs(sin(u_time * 0.5));
        float value2 = pow(uv2.x, 4. * abs(sin(u_time * 0.5) )+ 1.);
        
        float line = smoothstep(0., 0.01, abs(uv2.y - 0.5));
        float top = smoothstep(0., 0.0075, abs(uv2.y - mix(0.5, 1.0, value1)));
        float bottom = smoothstep(0., 0.0075, abs(uv2.y - mix(0.0, 0.5, value2)));

        if(uv2.y > 0.5){
            color = mix(green, cyan, value1);
        } else {
            color = mix(green, cyan, value2);
        }

        color = mix(vec3(1.), color, line);
        color = mix(vec3(1.), color, top);
        color = mix(vec3(1.), color, bottom);

        float numLabel = label(vUv);
        color = mix(color, vec3(0.), numLabel) ;
        gl_FragColor = vec4(color, 1.);
    }
`

const vertexShader = glsl`
varying vec2 vUv;
attribute vec3 newColors;

varying vec3 vColor;

void main()
{
    vColor = newColors;
    
    // gl_Position = vec4(position, 1.);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    vUv = uv;
}`

import { Vector2, ShaderMaterial } from 'three'
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'
import * as THREE from 'three'
import { folder, useControls } from 'leva'

export default function Shader678()
{
    const r = './Models/EnvMaps/1/';
    const urls = [ r + 'px.png', r + 'nx.png',
    r + 'py.png', r + 'ny.png',
    r + 'pz.png', r + 'nz.png' ];

    const textureCube = new THREE.CubeTextureLoader().load(urls)

    const loader = new THREE.TextureLoader()
    const material = new ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(window.innerWidth, window.inner) },
            u_mouse: { type: "v2", value: new Vector2() },
        },
    })

    const geometry = new THREE.PlaneGeometry(2., 2.)
    // geometry.setAttribute(
    //     'newColors',
    //     new THREE.Float32BufferAttribute(colorFloats, 3)
    // )


    const meshRef = useRef()

    let mouseX;
    let mouseY;

    let currentTime = 0
    useThree((state) => {
        currentTime = state.clock.elapsedTime
    })
    
    useFrame(({clock}) => {
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime - currentTime
        meshRef.current.material.uniforms.u_mouse.value = new Vector2(mouseX, mouseY)
        // console.log(meshRef.current.material.uniforms.u_time.value)
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
            <mesh 
                dispose={null} 
                ref={meshRef} 
                material={material} 
                geometry={geometry}
            />
        </>
    )
}