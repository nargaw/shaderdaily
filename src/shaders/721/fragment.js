import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    #define time u_time

    uniform sampler2D u_texture;
    uniform float u_waveFactor1;
    uniform float u_waveFactor2;

    // uniform float u_factor2;
    // uniform float u_speed;

    float label(vec2 p)
    {

        p *= 10.;
        // p *= 0.01;
        p.x -= 0.25;
        // p = p +  vec2(7., 3.5);
        float left = numSeven(vec2(p.x + 0.35, p.y));
        float center = numTwo(vec2(p.x -0.03, p.y));
        float right = numOne(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    float inverseLerp(float v, float minValue, float maxValue) {
        return (v - minValue) / (maxValue - minValue);
    }
        
    float remap(float v, float inMin, float inMax, float outMin, float outMax) {
        float t = inverseLerp(v, inMin, inMax);
        return mix(outMin, outMax, t);
    }

    vec3 saturate3(vec3 x){
        return clamp(x, vec3(0.0), vec3(1.0));
    }

    float saturate1(float x){
        return clamp(x, 0., 1.);
    }

    void main()
    {
        vec2 coords = vUv;
        vec3 color;

        vec2 newCoords = coords ;
        vec2 m = u_mouse.xy;

        vec2 offset = vec2(m) - 0.5  ;

        color = texture2D(u_texture, coords).rgb;

        float circle = sdCircle(newCoords - offset, 0.5);
        vec3 zoom = texture2D(u_texture, newCoords).rgb;
        color = mix(color, vec3(zoom.r, zoom.g * 0.1, zoom.b * 0.1), circle);
        
       
        float numLabel = label(vUv);
        color = mix(color, vec3(1.), numLabel) ;
        gl_FragColor = vec4(color, 1.);
    }
`

const vertexShader = glsl`
varying vec2 vUv;
uniform float u_time;
uniform vec2 u_mouse;

void main()
{
    vUv = uv;
    vec3 localSpacePosition = position;
    // gl_Position = vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(localSpacePosition, 1.);
}`

import { Vector2, ShaderMaterial } from 'three'
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'
import * as THREE from 'three'
import { useControls } from 'leva'

export default function Shader721()
{
    const r = './Models/EnvMaps/0/';
    const urls = [ 
        r + 'px.jpg', 
        r + 'nx.jpg',
        r + 'py.jpg', 
        r + 'ny.jpg',
        r + 'pz.jpg', 
        r + 'nz.jpg' ];

    const textureCube = new THREE.CubeTextureLoader().load(urls)

    const loader = new THREE.TextureLoader()
    const forest = loader.load('./Models/Textures/photos/forest.jpg')
    forest.wrapS = THREE.MirroredRepeatWrapping
    forest.wrapT = THREE.MirroredRepeatWrapping

    const {wave1, noiseVal} = useControls({
        wave1: {
            value: 2.,
            min: 0.,
            max: 5.,
            step: 0.1
        },
        noiseVal: {
            value: 1.5,
            min: 0.,
            max: 5.5,
            step: 0.01
        }
    })
    const DPR = Math.min(window.devicePixelRatio, 1.);
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader ,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_cameraPosition: {value: new THREE.Vector3()},
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { type: "v2", value: new Vector2() },
            u_texture: {value: forest},
            u_waveFactor1: {value: wave1},
            u_noiseFactor: {value: noiseVal}
        },
    })

    const geometry = new THREE.PlaneGeometry(2., 2., 256, 256)

    const icosaGeometry = new THREE.IcosahedronGeometry(1, 128)
    const meshRef = useRef()

    let mouseX;
    let mouseY;

    let currentTime = 0

    let sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
    })
    let camera
    useThree((state) => {
        currentTime = state.clock.elapsedTime
        camera = state.camera
    })
    let boundingBox
    const meshSizes = {
        width: 0,
        height: 0,
        leftPixel: 0,
        rightPixel: 0,
        topPixel: 0,
        bottomPixel: 0
    }

    useEffect(() => {
        if(meshRef.current)
        {
            boundingBox = new THREE.Box3().setFromObject(meshRef.current)

            const topLeft = new THREE.Vector3(
                meshRef.current.position.x - 2 / 2,
                meshRef.current.position.y + 2 / 2,
                meshRef.current.position.z,
            )

            const bottomLeft = new THREE.Vector3(
                meshRef.current.position.x - 2 / 2,
                meshRef.current.position.y - 2 / 2,
                meshRef.current.position.z,
            )

            const topRight = new THREE.Vector3(
                meshRef.current.position.x + 2 / 2,
                meshRef.current.position.y + 2 / 2,
                meshRef.current.position.z,
            )

            const bottomRight = new THREE.Vector3(
                meshRef.current.position.x + 2 / 2,
                meshRef.current.position.y - 2 / 2,
                meshRef.current.position.z,
            )
            
            topLeft.project(camera)
            bottomLeft.project(camera)
            topRight.project(camera)
            bottomRight.project(camera)

            //461 208 - check
            const topLeftX = (1 + topLeft.x) / 2 * window.innerWidth
            const topLeftY = (1 - topLeft.y) / 2 * window.innerHeight

            const bottomLeftX = (1 + bottomLeft.x) / 2 * window.innerWidth
            const bottomLeftY = (1 - bottomLeft.y) / 2 * window.innerHeight

            const topRightX = (1 + topRight.x) / 2 * window.innerWidth
            const topRightY = (1 - topRight.y) / 2 * window.innerHeight

            const bottomRightX = (1 + bottomRight.x) / 2 * window.innerWidth
            const bottomRightY = (1 - bottomRight.y) / 2 * window.innerHeight

            const shaderWidth = topRightX - topLeftX
            const shaderHeight = bottomRightY - topRightY

            meshSizes.width = shaderWidth
            meshSizes.height = shaderHeight
            meshSizes.leftPixel = topLeftX
            meshSizes.rightPixel = topRightX
            meshSizes.topPixel = topLeftY
            meshSizes.bottomPixel = bottomRightY
            
        }
    }, [])
    
    useFrame(({clock, camera}) => {
        material.uniforms.u_cameraPosition.value = camera.position
        material.uniforms.u_time.value = clock.elapsedTime - currentTime
        material.uniforms.u_mouse.value = new Vector2(mouseX, mouseY)
        meshRef.current.material.uniforms.u_resolution.value = new THREE.Vector2(
            window.innerWidth * DPR,
            window.innerHeight * DPR
        )
    })

    const remap = (value, low1, high1, low2, high2 ) => {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
    }

    addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / (window.innerWidth - (meshSizes.width))) * 2. - 1.;
        mouseX = remap(mouseX, 0., 0.85, 0., 1.)
        mouseY = (-(e.clientY / (window.innerHeight - meshSizes.height)) + 1) + 0.5;
        mouseY = remap(mouseY, 0.25, 1., 0., 1.)
    })

    addEventListener('contextmenu', e => e.preventDefault())

    addEventListener('touchmove', (e) => {
        mouseX = (e.changedTouches[0].clientX / window.innerWidth);
        mouseY = -(e.changedTouches[0].clientY / window.innerHeight) + 1;
    }, {passive: false})

    return (
        <>
            <mesh 
                ref={meshRef} 
                geometry={geometry}
                material={material}    
            />
        </>
    )
}