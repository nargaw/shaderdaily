import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    // https://www.shadertoy.com/view/4dSfDK
    #define S(a, b, t) smoothstep(a, b, t)
    #define time u_time

    uniform sampler2D u_texture;
    
    float label(vec2 p)
    {
        p *= 10.;
        // p *= 0.01;
        p.x -= 0.25;
        // p = p +  vec2(7., 3.5);
        float left = numEight(vec2(p.x + 0.35, p.y));
        float center = numFive(vec2(p.x -0.03, p.y));
        float right = numNine(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }
    
    mat2 Rot(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }

    float sdfBox(vec2 p, vec2 b){
        vec2 d = abs(p) -b;
        return length(max(d, 0.)) + min(max(d.x, d.y), 0.);
    }

     float sdfCircle(vec2 p, float r){
        return length(p) - r;
    }

    float softMax(float a, float b, float k)
    {
        return log(exp(k * a) + exp(k * b)) / k;
    }
    
    float softMin(float a, float b, float k)
    {
        return -softMax(-a, -b, k);
    }

    float opUnion(float d1, float d2)
    {
        return min(d1, d2);
    }
    

    void main()
    {
        vec2 coords = vUv;
        vec3 color;

        vec2 box1Coords = coords -0.5;
        box1Coords.y -= 0.5;

        vec2 box2Coords = coords - 0.5;
        box2Coords.y += 0.5;
        
        vec2 box3Coords = coords - 0.5;
        // box3Coords.y += 0.5;

        //box1Coords.x += 0.25;
        float box1 = sdfBox(box1Coords, vec2(0.5, 0.025));
        float box2 = sdfBox(box2Coords, vec2(0.5, 0.025));
        float box3 = sdfBox(box3Coords, vec2(0.5, 0.025));
        // box1 = smoothstep(0.0, 0.01, box1);
        // color = mix(vec3(0., 0., 1.), color, box1);
        vec2 cirCoords = coords;
        // cirCoords = Rot(cirCoords, u_time);
        vec2 circleCoords = cirCoords - 0.5;
        circleCoords.x -= 0.25;
        circleCoords.y -= mod(u_time * 0.125, 1.2) - 0.5;

        vec2 circleCoords2 = cirCoords - 0.5;
        circleCoords2.x += 0.45;
        circleCoords2.y -= mod(u_time * 0.135, 1.2) - 0.5;

        vec2 circleCoords3 = cirCoords - 0.5;
        circleCoords3.x -= 0.45;
        circleCoords3.y -= mod(u_time * 0.145, 1.2) - 0.5;

        vec2 circleCoords4 = cirCoords - 0.5;
        circleCoords4.x += 0.25;
        circleCoords4.y -= mod(u_time * 0.155, 1.2) - 0.5;

        vec2 circleCoords5 = cirCoords - 0.5;
        circleCoords5.y -= mod(u_time * 0.115, 1.2) - 0.5;
        
        // cCoords.x += 0.4;
        
        // float d;
        // for(int i = 1; i < 10; i++){
        //     vec2 cCoords = coords;
        //     // cCoords.x += 0.4;
        //     // cCoords.x += float(i)/10.;
        //     float c = sdfCircle(vec2(cCoords.x - (float(i)/(15. * 0.5)), cCoords.y - 0.5 ), 0.05);
        //     d += c;    
            
        // }
        
        
        float shape1;
        float c;
        vec2 cCoords = coords - 0.5;
        // for (int i=1; i<=5; i++)
        // {
            
        //     // c = sdfCircle(vec2(cCoords.x - mod(u_time * 0.135, 1.0), cCoords.y - (float(i)/15.) * 2.5) + 0.5, 0.1);
        //     c = sdfCircle(vec2(cCoords.x- (float(i)/25.)  + 0.5 , cCoords.y - mod(u_time * 0.135, 1.0) + 0.5), 0.1);
        //     shape1 += c;
        // }
        // color += 1. - shape1;
        
        float cir1 = sdfCircle(circleCoords, 0.1);
        float cir2 = sdfCircle(circleCoords2, 0.08);
        float cir3 = sdfCircle(circleCoords3, 0.06);
        float cir4 = sdfCircle(circleCoords4, 0.04);
        float cir5 = sdfCircle(circleCoords5, 0.06);


        float d = opUnion(cir1, opUnion(cir2, opUnion(cir3, opUnion(cir4, cir5))));
        d = softMin(d, box1, 25.);
        d = softMin(box2, d, 25.);
        d = softMin(box3, d, 25.);

        
        color = mix(vec3(1.), color, smoothstep(0.0, 0.005, d));

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

export default function Shader859()
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