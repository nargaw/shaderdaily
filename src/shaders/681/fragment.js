import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    #define grid 10.
    #define time u_time

    uniform sampler2D u_texture;
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numEight(vec2(p.x -0.03, p.y));
        float right = numOne(vec2(p.x - 0.42, p.y));
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


    //sqrt(x,y) -> x ^ y
    //inversesqrt(x) -> 1. / sqrt(x)
    //pow(x, y) -> x pow y
    //exp(x) -> e to pow x
    //exp2(x) -> raises 2 to pow x
    //log(x) -> natural log of x
    //log2(x) -> base 2 log of x

    //  Function from Iñigo Quiles
    //  www.iquilezles.org/www/articles/functions/functions.htm
    float cubicPulse( float c, float w, float x ){
        x = abs(x - c);
        if( x>w ) return 0.0;
        x /= w;
        return 1.0 - x*x*(5.0-1.0*x);
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
        vec3 color = vec3(0.);
        // uv2 -= 0.5;

    

        vec2 m = vec2(u_mouse.x, -u_mouse.y);
        float n = noise2D(uv2 * cubicPulse(0.5, 0.2, tan(time))) * 0.5;
       

        // uv2.x += tan(n * 0.01);
        float t1 = remap(sin(uv2.y * 40. + time * 10. * n), -1., 1., 0.9, 1.);
        float t2 = remap(sin(uv2.y * 10. - time * 2. * n), -1., 1., 0.9, 1.);
        float t3 = remap(sin(uv2.y * 400. + time * 10.), -1., 1., 0.9, 1.);
        float t4 = remap(sin(uv2.y * 50. - time * 2.), -1., 1., 0.9, 1.);

        color = texture2D(u_texture, uv2 + n).xyz * t1 * t2 * t3 * t4;

        float numLabel = label(vUv);
        color = mix(color, vec3(1.), numLabel) ;
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

export default function Shader681()
{
    const r = './Models/EnvMaps/1/';
    const urls = [ r + 'px.png', r + 'nx.png',
    r + 'py.png', r + 'ny.png',
    r + 'pz.png', r + 'nz.png' ];

    const textureCube = new THREE.CubeTextureLoader().load(urls)

    const loader = new THREE.TextureLoader()

    const tvTexture = loader.load('./Models/Textures/TV/tv.jpg')
   
    const material = new ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(window.innerWidth, window.inner) },
            u_mouse: { type: "v2", value: new Vector2() },
            u_texture: {value: tvTexture}
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