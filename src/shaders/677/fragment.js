import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    #define grid 10.
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numSeven(vec2(p.x -0.03, p.y));
        float right = numSeven(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    vec3 red = vec3(1., 0., 0.);
    vec3 blue = vec3(0., 0., 1.);
    vec3 white = vec3(1., 1., 1.);
    vec3 green = vec3(0., 1., 0.);
    vec3 cyan = vec3(0., 1., 1.);
    vec3 orange = vec3(1., 0.75, 0.5);
    vec3 purple = vec3(1., 0., 1.);
    vec3 black = vec3(0., 0., 0.);
    vec3 yellow = vec3(1., 1., 0.);

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
  
        vec3 color = vec3(0.75);
        
        vec2 center = uv2 - 0.5;

        //abs -10 -> 10
        //floor 1.8 -> 1
        //ceil 1.1 -> 2
        //round 5.6 -> 6
        //fract eg 2.9 -> 0.9
        //modulo mod(5.2, 2.5) -> 0.2 remainder



        //grid
        vec2 cell = fract(center * grid);
        cell = abs(cell - 0.5);
        float distToCell = 1. - 2. * max(cell.x, cell.y);
        float cellLine = smoothstep(0.0, 0.05, distToCell);
        float xAxis = smoothstep(0.0, 0.002, abs(uv2.y - 0.5));
        float yAxis = smoothstep(0.0, 0.002, abs(uv2.x - 0.5));

        //lines
        vec2 pos = center * grid;
        float value1 = pos.x;
        float value2 = abs(pos.x);
        float value3 = floor(pos.x);
        float value4 = ceil(pos.x);
        float value5 = round(pos.x);
        float value6 = fract(pos.x);
        float funcLine1 = smoothstep(0.0, 0.075, abs(pos.y - value1));
        float funcLine2 = smoothstep(0.0, 0.075, abs(pos.y - value2));
        float funcLine3 = smoothstep(0.0, 0.075, abs(pos.y - value3));
        float funcLine4 = smoothstep(0.0, 0.075, abs(pos.y - value4));
        float funcLine5 = smoothstep(0.0, 0.075, abs(pos.y - value5));
        float funcLine6 = smoothstep(0.0, 0.075, abs(pos.y - value6));

        color = mix(black, color, cellLine);
        color = mix(blue, color, xAxis);
        color = mix(blue, color, yAxis);
        color = mix(yellow, color, funcLine1);
        color = mix(red, color, funcLine2);
        color = mix(green, color, funcLine3);
        color = mix(cyan, color, funcLine4);
        color = mix(purple, color, funcLine5);
        color = mix(orange, color, funcLine6);
        // color = vec3(cellLine);
        

        float numLabel = label(vUv);
        color = mix(color, vec3(0.), numLabel) ;
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

export default function Shader677()
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