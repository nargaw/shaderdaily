import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numSeven(vec2(p.x -0.03, p.y));
        float right = numFive(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
  
        vec3 color = vec3(0.);
        vec3 red = vec3(1., 0., 0.);
        vec3 blue = vec3(0., 0., 1.);
        vec3 white = vec3(1.);

        //min(x, y) return min
        //max(x, y) return max
        //clamp(a, minVal, maxVal) if < minVal -> 0, if < maxVal -> 1
        //saturate(a) between 0 and 1

        float value1 = min(uv2.x, 0.25);
        float value2 = max(uv2.x, 0.75);
        float value3 = clamp(uv2.x, 0.25, 0.75);

        float bottomLine = smoothstep(0., 0.005, abs(uv2.y - 0.33));
        float topLine = smoothstep(0., 0.005, abs(uv2.y - 0.66));
        float maxLine = smoothstep(0., 0.0075, abs(uv2.y - mix(0.33, .66, value2)));
        float clampLine = smoothstep(0., 0.0075, abs(uv2.y - mix(0.0, 0.33, value3)));
        float minLine = smoothstep(0., 0.0075, abs(uv2.y - mix(0.66, 1.00, value1)));

        if(uv2.y > 0.33 && uv2.y < 0.66){
            color = mix(red,blue, value2);
        } else if(uv2.y < 0.33){
            color = mix(red, blue, value3);
        } else {
            color = mix(red,blue, value1);
        }

        color = mix(white,color, bottomLine);
        color = mix(white,color, topLine);
        color = mix(white,color, maxLine);
        color = mix(white,color, clampLine);
        color = mix(white,color, minLine);

        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
        // gl_FragColor = texture2D(u_diffuse, vUv);
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

export default function Shader675()
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
            u_resolution: { type: "v2", value: new Vector2(1, 1) },
            u_mouse: { type: "v2", value: new Vector2() },
        },
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    // geometry.setAttribute(
    //     'newColors',
    //     new THREE.Float32BufferAttribute(colorFloats, 3)
    // )


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
            <mesh 
                dispose={null} 
                ref={meshRef} 
                material={material} 
                geometry={geometry}
            />
        </>
    )
}