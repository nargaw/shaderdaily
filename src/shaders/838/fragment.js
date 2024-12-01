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
        float right = numEight(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }
    
    mat2 Rot(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }

    //https://iquilezles.org/articles/palettes/
    vec3 palette( float t ) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.263,0.416 * u_time,0.557);

        return a + b*cos( 6.28318*(c*t+d) );
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

        vec2 glowCoords = coords;
        glowCoords -= mouse5;

        vec2 gCoords1 = coords ;
        gCoords1 -= mouse;
        vec2 gCoords2 = coords;
        gCoords2 -= mouse2;
        vec2 gCoords3 = coords;
        gCoords3 -= mouse3;
        vec2 gCoords4 = coords;
        gCoords4 -= mouse4;
        vec2 gCoords5 = coords;
        gCoords5 -= mouse5;

        // float 
        float d1 = sdPolygonOutline(gCoords1 + 0.5, 3, 0.1);
        d1 += length(gCoords1) * exp(-length(gCoords1));
        d1 = (d1 * 10.) / 5.;
        d1 = abs(d1);
        d1 = pow(0.01/d1, 1.);

        float d2 = sdPolygonOutline(gCoords2 + 0.5, 3, 0.1);
        d2 += length(gCoords2) * exp(-length(gCoords2));
        d2 = (d2 * 10.) / 5.;
        d2 = abs(d2);
        d2 = pow(0.01/d2, 1.);

        float d3 = sdPolygonOutline(gCoords3 + 0.5, 3, 0.1);
        d3 += length(gCoords3) * exp(-length(gCoords3));
        d3 = (d3 * 10.) / 5.;
        d3 = abs(d3);
        d3 = pow(0.01/d3, 1.);

        float d4 = sdPolygonOutline(gCoords4 + 0.5, 3, 0.1);
        d4 += length(gCoords4) * exp(-length(gCoords4));
        d4 = (d4 * 10.) / 5.;
        d4 = abs(d4);
        d4 = pow(0.01/d4, 1.);

        float d5 = sdPolygonOutline(gCoords5 + 0.5, 3, 0.1);
        d5 += length(gCoords5) * exp(-length(gCoords5));
        d5 = (d5* 10.) / 5.;
        d5 = abs(d5);
        d5 = pow(0.01/d5, 1.);


        vec3 c = palette(length(glowCoords) + u_time * .4);
        
        color += c * (d1 + d2 + d3 + d4 + d5);


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


export default function Shader838()
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