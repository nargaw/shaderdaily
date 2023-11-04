import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numFour(vec2(p.x -0.03, p.y));
        float right = numTwo(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    
    void main()
    {

        vec2 vUv = vec2(vUv.x, vUv.y);
        // vec2 vUv = gl_FragCoord.xy/u_resolution.xy;
        vec3 color = vec3(0.);
        vec2 m = u_mouse.xy;
        vec2 uv2 = vUv;
        uv2 -= .5;

        vec3 col = vec3((sin(u_time)/2.) + 0.5, 0.5, 0.);

        float d = length(vUv - abs(u_mouse.xy)) - 0.2;
        color += (step(0., -d)) * col;

        float glow = 0.005/ d;
        glow = clamp(glow, 0., 1.);
        glow = glow * 15. * (sin(u_time)/10. + 0.75);

        color += col * glow ;

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

export default function Shader642()
{
    const r = './Models/EnvMaps/0/';
    // const urls = [ r + 'posx.jpg', r + 'negx.jpg',
    // r + 'posy.jpg', r + 'negy.jpg',
    // r + 'posz.jpg', r + 'negz.jpg' ];
    const urls = [ r + 'px.jpg', r + 'nx.jpg',
    r + 'py.jpg', r + 'ny.jpg',
    r + 'pz.jpg', r + 'nz.jpg' ];

    const textureCube = new THREE.CubeTextureLoader().load(urls)
    // console.log(textureCube)

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
            u_resolution: { type: "v2", value: new Vector2(1, 1) },
            u_mouse: { type: "v2", value: new Vector2() },
            u_cubemap: { value: textureCube}
        }
    })


    const meshRef = useRef()

    let mouseX;
    let mouseY;

    const size = new THREE.Vector3()
    const topLeft = new THREE.Vector3(-1, -1, 0)
    const topRight = new THREE.Vector3(1, -1, 0)
    const bottomLeft = new THREE.Vector3(-1, 1, 0)
    const bottomRight = new THREE.Vector3(1, 1, 0)
    useEffect(() => {
        const bbox = new THREE.Box3().setFromObject(meshRef.current).getSize(size)
    }, [meshRef.current])

    useThree(({camera}) => {
        if(topLeft){
            size.project(camera)
            topLeft.project(camera)
            // console.log(topLeft)
        }
        // console.log(size)
    })

    const sizeX = (1 + size.x) / 2 * window.innerWidth
    const sizeY = (1 - size.y) / 2 * window.innerHeight

    // console.log(sizeX, sizeY)

    const topLeftX = (1 + topLeft.x) / 2 * window.innerWidth
    const topLeftY = (1 - topLeft.y) / 2 * window.innerHeight

    const topRightX = (1 + topRight.x) / 2 * window.innerWidth
    const topRightY = (1 - topRight.y) / 2 * window.innerHeight

    // const bottomLeftX = (1 + bottomLeft.x) / 2 * window.innerWidth
    // const bottomLeftY = (1 - bottomLeft.y) / 2 * window.innerHeight

    // const bottomRightX = (1 + bottomRight.x) / 2 * window.innerWidth
    // const bottomRightY = (1 - bottomRight.y) / 2 * window.innerHeight

    // console.log(topLeftX, topLeftY)
    // console.log(topRightX, topRightY)

    // const planeWidth = (topRightX - topLeftX)

    // console.log(planeWidth)
    
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
                <boxGeometry args={[2, 2, 0.1]} />
            </mesh>
        </>
    )
}