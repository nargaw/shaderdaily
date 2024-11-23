import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    // https://www.shadertoy.com/view/4dSfDK
    #define S(a, b, t) smoothstep(a, b, t)
    #define time u_time

    uniform sampler2D u_texture;
    
    uniform vec2 u_mouse2;
    uniform vec2 u_mouse3;
    uniform vec2 u_mouse4;
    uniform vec2 u_mouse5;

    float label(vec2 p)
    {
        p *= 10.;
        // p *= 0.01;
        p.x -= 0.25;
        // p = p +  vec2(7., 3.5);
        float left = numEight(vec2(p.x + 0.35, p.y));
        float center = numThree(vec2(p.x -0.03, p.y));
        float right = numFive(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }
    
    mat2 Rot(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }

    void main()
    {
        vec2 coords = vUv;
        vec3 color;

        vec2 mouse = u_mouse;
        vec2 mouse2 = u_mouse2;
        vec2 mouse3 = u_mouse3;
        vec2 mouse4 = u_mouse4;
        vec2 mouse5 = u_mouse5;

        vec2 tCoords = coords;
        vec3 t = texture2D(u_texture, tCoords).rgb;

        vec2 polygon1Coords = coords;
        polygon1Coords -= mouse - 0.5;
        polygon1Coords = Rot(polygon1Coords, u_time * 0.5);

        vec2 polygon2Coords = coords;
        polygon2Coords -= mouse2 - 0.5;
        polygon2Coords = Rot(polygon2Coords, u_time * 0.5);

        vec2 polygon3Coords = coords;
        polygon3Coords -= mouse3 - 0.5;
        polygon3Coords = Rot(polygon3Coords, u_time * 0.5);

        vec2 polygon4Coords = coords;
        polygon4Coords -= mouse4 - 0.5;
        polygon4Coords = Rot(polygon4Coords, u_time * 0.5);

        vec2 polygon5Coords = coords;
        polygon5Coords -= mouse5 - 0.5;
        polygon5Coords = Rot(polygon5Coords, u_time * 0.5);
    
        float square = sdPolygonOutline(polygon1Coords,  6, 0.1 * 0.75);
        float square2 = sdPolygonOutline(polygon2Coords, 6, 0.2 * 0.75);
        float square3 = sdPolygonOutline(polygon3Coords, 6, 0.3 * 0.75);
        float square4 = sdPolygonOutline(polygon4Coords, 6, 0.4 * 0.75);
        float square5 = sdPolygonOutline(polygon5Coords, 6, 0.5 * 0.75);

        square = pow(square, 0.005);

        color = mix(color, t * vec3(1., 0., 1.), square * 1.);
        color = mix(color, t * vec3(1., 0., 0.), square2 * 2.);
        color = mix(color, t * vec3(1., 1., 0.), square3 * 2.);
        color = mix(color, t * vec3(0., 1., 0.), square4 * 2.);
        color = mix(color, t * vec3(0., 1., 1.), square5 * 2.);

        // float poly = square + square2 + square3 + square4 + square5;
        // poly *= 0.5;
        // poly = pow(poly, 0.05);
        // color = poly * vec3(0.,1., 0.5);
        
        // color = vec3(step(0., -poly));
        // color += clamp(vec3(0.001 / poly), 0., 1.) * 10.;
        // color *- vec3(1., 1., 0.);

        vec2 numCoords = coords;
        float numLabel = label(numCoords);

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
    gl_Position = projectionMatrix * modelViewMatrix * vec4(localSpacePosition, 1.);
}`

import { Vector2, ShaderMaterial } from 'three'
import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'
import * as THREE from 'three'
import { lerp } from 'three/src/math/MathUtils.js'
import { useControls } from 'leva'
import { Text } from '@react-three/drei'


export default function Shader835()
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
    const night = loader.load('./Models/Textures/photos/night.jpg')
    night.wrapS = THREE.MirroredRepeatWrapping
    night.wrapT = THREE.MirroredRepeatWrapping

    const DPR = Math.min(window.devicePixelRatio, 1.);

    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader ,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_cameraPosition: {value: new THREE.Vector3()},
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { value: new THREE.Uniform(new THREE.Vector2()) },
            u_mouse2: { value: new THREE.Uniform(new THREE.Vector2()) },
            u_mouse3: { value: new THREE.Uniform(new THREE.Vector2()) },
            u_mouse4: { value: new THREE.Uniform(new THREE.Vector2()) },
            u_mouse5: { value: new THREE.Uniform(new THREE.Vector2()) },
            u_texture: {value: night},
        },
    })

    const meshSize = 2
    
    const geometry = new THREE.PlaneGeometry(meshSize, meshSize, 256, 256)
    const meshRef = useRef()

     //mouse value 1
     let mouseX = 0;
     let mouseY = 0;

     //mouse value 2
     let mouseX2 = 0;
     let mouseY2 = 0;

     //mouse value 3
     let mouseX3 = 0;
     let mouseY3 = 0;

     //mouse value 4
     let mouseX4 = 0;
     let mouseY4 = 0;

     //mouse value 5
     let mouseX5 = 0;
     let mouseY5 = 0;

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
        material.uniforms.u_mouse2.value = new Vector2(mouseX2, mouseY2)
        material.uniforms.u_mouse3.value = new Vector2(mouseX3, mouseY3)
        material.uniforms.u_mouse4.value = new Vector2(mouseX4, mouseY4)
        material.uniforms.u_mouse5.value = new Vector2(mouseX5, mouseY5)
        meshRef.current.material.uniforms.u_resolution.value = new THREE.Vector2(
            dimensions.width * DPR,
            dimensions.height * DPR
        )

        mouseX = lerp(mouseX, tempValX, 0.01)
        mouseY = lerp(mouseY, tempValY, 0.01)

        mouseX2 = lerp(mouseX2, tempValX, 0.015)
        mouseY2 = lerp(mouseY2, tempValY, 0.015)

        mouseX3 = lerp(mouseX3, tempValX, 0.02)
        mouseY3 = lerp(mouseY3, tempValY, 0.02)

        mouseX4 = lerp(mouseX4, tempValX, 0.025)
        mouseY4 = lerp(mouseY4, tempValY, 0.025)

        mouseX5 = lerp(mouseX5, tempValX, 0.03)
        mouseY5 = lerp(mouseY5, tempValY, 0.03)
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
            <mesh 
                ref={meshRef} 
                geometry={geometry}
                material={material}    
            />
        </>
    )
}