import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    // https://www.shadertoy.com/view/4dSfDK
    #define S(a, b, t) smoothstep(a, b, t)
    #define time u_time

    uniform sampler2D u_texture;
    
    uniform vec2 u_mouse2;
    uniform vec2 u_mouse3;


    float label(vec2 p)
    {
        p *= 10.;
        // p *= 0.01;
        p.x -= 0.25;
        // p = p +  vec2(7., 3.5);
        float left = numEight(vec2(p.x + 0.35, p.y));
        float center = numFour(vec2(p.x -0.03, p.y));
        float right = numTwo(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }
    
    // mat2 Rot(float a){
    //     float s = sin(a);
    //     float c = cos(a);
    //     return mat2(c, -s, s, c);
    // }

    //https://iquilezles.org/articles/palettes/
    vec3 palette( float t ) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263,0.416 * u_time * 0.1,0.557);

        return a + b*cos( 6.28318*(c*t+d) );
    }
    
    float randFloat(float x){
        return fract(sin(x) * 4748393.7585);
    }

    float randVec2(vec2 vUv){
        return fract(sin(dot(vUv.yx, vec2(48.48929, 76.83929))) * 727827.3738);
    }

    void main()
    {
        vec2 coords = vUv;
        vec2 numCoords = coords;

        // float rand = randVec2(coords) * 0.2;
        coords.x *= 10.;
        coords = fract(vec2(coords.x, coords.y));
        

        vec3 color;
        vec2 pCoords = coords;
        vec2 nCoords = coords;
        nCoords.x -= 0.5;
        pCoords.y -= 2.0 * mod(u_time * 0.25, 1.);
        nCoords.y -= step(0.0,nCoords.y) * 2.0;
        float w = -(1./ (25. * pCoords.y));
        vec3 l = vec3(w * 2.5, w, w * 1.);
        nCoords.x *= 2.;
        float x = abs(1./(20. * max(abs(nCoords.y), 0.3)));
        nCoords.y *= 3.;
        nCoords.y -=  x * (sin(nCoords.y)+3.0*sin(2.0*nCoords.y)+2.0*sin(3.0*nCoords.y)+sin(4.0*nCoords.y)) ;
        color = mix(l, vec3(0.), smoothstep(0.02, 0.03, abs(nCoords.x)));

        // color = vec3(coords - a, 0.);
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


export default function Shader842()
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
        meshRef.current.material.uniforms.u_resolution.value = new THREE.Vector2(
            dimensions.width * DPR,
            dimensions.height * DPR
        )

        mouseX = lerp(mouseX, tempValX, 0.01)
        mouseY = lerp(mouseY, tempValY, 0.01)

        mouseX2 = lerp(mouseX2, tempValX, 0.0125)
        mouseY2 = lerp(mouseY2, tempValY, 0.0125)

        mouseX3 = lerp(mouseX3, tempValX, 0.015)
        mouseY3 = lerp(mouseY3, tempValY, 0.015)

        
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