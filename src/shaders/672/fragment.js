import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numSeven(vec2(p.x -0.03, p.y));
        float right = numTwo(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }
    
    uniform sampler2D u_diffuse;

    varying vec3 vColor;
    uniform vec3 u_Color1;
    uniform vec3 u_Color2;
    uniform float u_noiseVal;
    uniform vec4 u_tint;

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
        // uv2 -= 0.125;

        vec2 m = u_mouse.xy;
        vec3 color = vec3(0.);
        float n = noise2D(uv2 + (u_time + u_noiseVal)) * 0.1;
        // uv2 *= n;
        // color = vColor;
        color *= uv2.x + n * u_noiseVal;
        color *= uv2.y + n * u_noiseVal;
       
        // vec4 textureColor = texture2D(u_diffuse, vUv);
        // color += textureColor.xyz;


        //mix
        //mix(a, b, t) - linearly interpolate between a & b using t as a percentage
        vec4 diffuseSample = texture2D(u_diffuse, uv2) * u_tint;
        color += diffuseSample.rgb;

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

export default function Shader672()
{
    const r = './Models/EnvMaps/1/';
    const urls = [ r + 'px.png', r + 'nx.png',
    r + 'py.png', r + 'ny.png',
    r + 'pz.png', r + 'nz.png' ];

    const textureCube = new THREE.CubeTextureLoader().load(urls)

    const loader = new THREE.TextureLoader()
    const metal =  loader.load('./Models/Textures/Metal/color.jpg')
    // console.log(metal)
    const {x, y, z, w} = useControls('tint color', {
        x:      
            {
                value: 1,
                min: 0,
                max: 1,
                step: 0.01,
                label: 'r'
            },
            y:      
            {
                value: 1,
                min: 0,
                max: 1,
                step: 0.01,
                label: 'g'
            } ,
            z:      
            {
                value: 1,
                min: 0,
                max: 1,
                step: 0.01,
                label: 'b'
            } ,
            w:      
            {
                value: 1,
                min: 0,
                max: 1,
                step: 0.01,
                label: 'a'
            }    
    })
    // const { color1, color2, color3, color4 } = useControls('Colors', {
    //     color1: '#ff0000',
    //     color2: '#00ff00',
    //     color3: '#0000ff',
    //     color4: '#00ffff'
    // }) 

    // const { noiseVal } = useControls('Noise', {
    //     noiseVal: {
    //         value: 1,
    //         min: 1,
    //         max: 10,
    //         step: 0.01,
    //         label: 'Noise Val'
    //     }
    // })

    // const colors = [
    //     new THREE.Color(color1),
    //     new THREE.Color(color2),
    //     new THREE.Color(color3),
    //     new THREE.Color(color4)
    // ]

    // const colorFloats = colors.map(c => c.toArray()).flat()

    const material = new ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(1, 1) },
            u_mouse: { type: "v2", value: new Vector2() },
            u_diffuse: { value: metal},
            u_cubemap: { value: textureCube},
            u_tint: { value: new THREE.Vector4(x, y, z, w)}
            // u_noiseVal: {value: noiseVal }
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