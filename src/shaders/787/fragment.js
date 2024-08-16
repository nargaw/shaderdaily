import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    #define time u_time

    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform sampler2D u_texture;
    uniform sampler2D u_texture2;
    uniform vec2 u_mouse2;
    uniform vec2 u_mouse3;

    float label(vec2 p)
    {

        p *= 10.;
        // p *= 0.01;
        p.x -= 0.25;
        // p = p +  vec2(7., 3.5);
        float left = numSeven(vec2(p.x + 0.35, p.y));
        float center = numEight(vec2(p.x -0.03, p.y));
        float right = numSeven(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

   
    void main()
    {
        vec2 coords = vUv;
        vec3 normal = normalize(vNormal);
        vec3 color = vec3(1., 0., 1.);
        vec2 m = u_mouse.xy;
        vec2 offset  =  vec2(u_mouse.xy);  
        vec2 offset2 = vec2(u_mouse2.xy); 
        vec2 offset3 = vec2(u_mouse3.xy);



        float numLabel = label(vUv);
        color = mix(color, vec3(1.), numLabel) ;
        gl_FragColor = vec4(color, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
    }
`

const vertexShader = glsl`
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal; 
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_size;
uniform vec2 u_resolution;

void main()
{
    //the model position is given the new displaced position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //the new projected position is calucated for the vertices based on the displacement
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_PointSize = u_size * u_resolution.y;
    gl_PointSize *= 1.0 / - viewPosition.z;

    //this value is passed to the fragment shader
    gl_Position = projectedPosition;
}
`

import { Vector2, ShaderMaterial } from 'three'
import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'
import * as THREE from 'three'
import { useControls } from 'leva'
import { OrbitControls, Text } from '@react-three/drei'
import { lerp } from 'three/src/math/MathUtils.js'
import { texture } from 'three/examples/jsm/nodes/Nodes.js'


export default function Shader787()
{
    const {size, count} = useControls({
        size: {
            value: 0.5,
            min: 0.01,
            max: 0.1,
            step: 0.001
        },
        count: {
            value: 50,
            min: 10,
            max: 100,
            step: 1
        }
    })

    const loader = new THREE.TextureLoader()

    const DPR = Math.min(window.devicePixelRatio, 2.);

    const textures = [
        loader.load('./Models/Textures/fireworks/1.png'),
        loader.load('./Models/Textures/fireworks/2.png'),
        loader.load('./Models/Textures/fireworks/3.png'),
        loader.load('./Models/Textures/fireworks/4.png'),
        loader.load('./Models/Textures/fireworks/5.png'),
        loader.load('./Models/Textures/fireworks/6.png'),
        loader.load('./Models/Textures/fireworks/7.png'),
        loader.load('./Models/Textures/fireworks/8.png')
    ]
    const texture = textures[7]
    const material = new THREE.ShaderMaterial({
        // wireframe: true,
        vertexShader: vertexShader ,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_cameraPosition: {value: new THREE.Vector3()},
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { type: "v2", value: new Vector2() },
            u_mouse2: { value: new THREE.Uniform(new THREE.Vector2()) },
            u_mouse3: { value: new THREE.Uniform(new THREE.Vector2()) },
            u_size: {value: size},
            u_texture: new THREE.Uniform(texture)
        },
    })

    const meshSize = 2
    
    // const geometry = new THREE.PlaneGeometry(meshSize, meshSize, 256, 256)
    // const geometry = new THREE.OctahedronGeometry(0.5, 128)
    //fireworks geometry
    const positionsArray = new Float32Array(count * 3)
    for(let i = 0; i < count; i++){
        const i3 = i * 3
        positionsArray[i3] = Math.random() - 0.5
        positionsArray[i3 + 1] = Math.random() - 0.5
        positionsArray[i3 + 2] = Math.random() - 0.5
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3)) 
    const meshRef = useRef()

    const pointsMaterial = new THREE.PointsMaterial()


     //mouse value 1
     let mouseX = 0;
     let mouseY = 0;
 
     //mouse value 2
     let mouseX2 = 0;
     let mouseY2 = 0;
 
     //mouse value 3
     let mouseX3 = 0;
     let mouseY3 = 0;

    let tempValX = 0;
    let tempValY = 0;

    let currentTime = 0

    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })

    const handleResize = () => {
        setDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }

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
                meshRef.current.position.x - meshSize / 2,
                meshRef.current.position.y + meshSize / 2,
                meshRef.current.position.z,
            )

            const bottomLeft = new THREE.Vector3(
                meshRef.current.position.x - meshSize / 2,
                meshRef.current.position.y - meshSize / 2,
                meshRef.current.position.z,
            )

            const topRight = new THREE.Vector3(
                meshRef.current.position.x + meshSize / 2,
                meshRef.current.position.y + meshSize / 2,
                meshRef.current.position.z,
            )

            const bottomRight = new THREE.Vector3(
                meshRef.current.position.x + meshSize / 2,
                meshRef.current.position.y - meshSize / 2,
                meshRef.current.position.z,
            )
            
            topLeft.project(camera)
            bottomLeft.project(camera)
            topRight.project(camera)
            bottomRight.project(camera)

            const topLeftX = (1 + topLeft.x) / 2 * dimensions.width
            const topLeftY = (1 - topLeft.y) / 2 * dimensions.height
            

            const bottomLeftX = (1 + bottomLeft.x) / 2 * dimensions.width
            const bottomLeftY = (1 - bottomLeft.y) / 2 * dimensions.height

            const topRightX = (1 + topRight.x) / 2 * dimensions.width
            const topRightY = (1 - topRight.y) / 2 * dimensions.height
            // console.log(topRightX, topRightY)

            const bottomRightX = (1 + bottomRight.x) / 2 * dimensions.width
            const bottomRightY = (1 - bottomRight.y) / 2 * dimensions.height

            const shaderWidth = topRightX - topLeftX
            const shaderHeight = bottomRightY - topRightY

            meshSizes.width = shaderWidth
            meshSizes.height = shaderHeight
            meshSizes.leftPixel = topLeftX

            meshSizes.rightPixel = topRightX
            meshSizes.topPixel = topLeftY
            meshSizes.bottomPixel = bottomRightY

            window.addEventListener('resize', handleResize, false)
        }
    }, [])
    
    useFrame(({clock, camera}) => {
        material.uniforms.u_cameraPosition.value = camera.position
        material.uniforms.u_time.value = clock.elapsedTime - currentTime
        material.uniforms.u_mouse.value = new Vector2(mouseX, mouseY)
        material.uniforms.u_mouse2.value = new THREE.Vector2(mouseX2, mouseY2)
        material.uniforms.u_mouse3.value = new THREE.Vector2(mouseX3, mouseY3)

        material.uniforms.u_resolution.value = new THREE.Vector2(
            dimensions.width * DPR,
            dimensions.height * DPR
        )

        mouseX = lerp(mouseX, tempValX, 0.09)
        mouseY = lerp(mouseY, tempValY, 0.09)

        mouseX2 = lerp(mouseX2, tempValX, 0.08)
        mouseY2 = lerp(mouseY2, tempValY, 0.08)

        mouseX3 = lerp(mouseX3, tempValX, 0.07)
        mouseY3 = lerp(mouseY3, tempValY, 0.07)
    })

    const remap = (value, low1, high1, low2, high2 ) => {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
    }

    addEventListener('mousemove', (e) => {
        if(e.clientX >= meshSizes.leftPixel && e.clientX <= meshSizes.rightPixel){
            tempValX = remap(e.clientX, meshSizes.leftPixel, meshSizes.rightPixel, 0, 1)
        }
        if(e.clientY >= meshSizes.topPixel && e.clientY <= meshSizes.bottomPixel){
            tempValY = remap(e.clientY, meshSizes.topPixel, meshSizes.bottomPixel, 1, 0)
        }
    })

    addEventListener('contextmenu', e => e.preventDefault())

    addEventListener('touchmove', (e) => {
        if(e.clientX >= meshSizes.leftPixel && e.clientX <= meshSizes.rightPixel){
            tempValX = remap(e.clientX, meshSizes.leftPixel, meshSizes.rightPixel, 0, 1)
        }
        if(e.clientY >= meshSizes.topPixel && e.clientY <= meshSizes.bottomPixel){
            tempValY = remap(e.clientY, meshSizes.topPixel, meshSizes.bottomPixel, 1, 0)
        }
    }, {passive: false})

    return (
        <>
            <OrbitControls />
            <points 
                ref={meshRef} 
                geometry={geometry}
                material={material}    
            />
        </>
    )
}