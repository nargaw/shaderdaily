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
        float left = numNine(vec2(p.x + 0.35, p.y));
        float center = numOne(vec2(p.x -0.03, p.y));
        float right = numEight(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }
    

// === Spinning star shape ===
float starShape(vec2 p, int spikes, float rotation) {
    float a = atan(p.y, p.x) + rotation;
    float r = length(p);
    float rays = mod(a * float(spikes) / PI, 2.0);
    float s = mix(0.35, 0.15, step(1.0, rays));
    float shape = smoothstep(s, s - 0.01, r);
    float starGlow = 0.015 / (r + 0.01);
    return shape + starGlow;
}

    void main()
    {
        vec2 coords = vUv;
        vec2 numCoords = coords; 

        // Shader: All Star Tribute
        // Inspired by Smash Mouth's "All Star"

    vec2 uv = coords;

    vec2 pos = uv * 2.0 - 1.0;
    // pos.x *= iResolution.x / iResolution.y;

    float t = u_time;

    // Somebody once told me
    float somebody = sin(t * 0.5);
    
    // The world is gonna roll me
    float roll = cos(length(pos) * 8.0 - t * 3.0);

    // I ain't the sharpest tool in the shed
    float sharpness = 0.25;

    // She was looking kind of dumb
    vec3 herLook = vec3(1.0, 0.85, 0.1);

    // With her finger and her thumb
    float fingerThumb = pow(fract(t), 2.0);

    // In the shape of an "L" on her forehead
    float L_shape = step(0.5, uv.x) * step(uv.y, 0.6);

    // Well, the years start coming
    float years = mod(t * 0.5, 100.0);

    // And they don't stop coming
    float nonstop = exp(-length(pos) * 5.0);

    // Fed to the rules and I hit the ground running
    float running = smoothstep(0.0, 1.0, t * 0.1);

    // Didn't make sense not to live for fun
    float fun = sin(t * 2.0);

    // Your brain gets smart
    float brain = pow(length(pos), 0.5);

    // But your head gets dumb
    float head = 1.0 - brain;

    // So much to do, so much to see
    float chaos = sin(dot(pos, vec2(12.9898, 78.233)) * 43758.5453);

    // So what's wrong with taking the back streets?
    float backstreets = step(0.4, length(uv - 0.5));

    // You'll never know if you don't go
    float go = step(0.5, sin(t + uv.x * 10.0));

    // You'll never shine if you don't glow
    float glow = exp(-10.0 * length(pos)) * abs(sin(t));

    // === Tunnel effect ===
    float radius = length(pos);
    float swirl = atan(pos.y, pos.x) + 0.5 * sin(t + radius * 12.0);
    vec2 swirlUV = vec2(cos(swirl), sin(swirl)) * radius;

    float star = starShape(swirlUV, 5, t * 2.0);

    // === Composite final color ===
    vec3 starColor = vec3(1.0, 1.0, 0.4) * glow;
    vec3 tunnelColor = mix(vec3(0.05, 0.1, 0.15), vec3(0.0, 0.4, 0.6), roll * 0.5 + 0.5);
    vec3 finalColor = tunnelColor + star * starColor;

    float numLabel = label(numCoords);

    finalColor = mix(finalColor, vec3(1.), numLabel) ;

    gl_FragColor = vec4(finalColor, 1.0);

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

export default function Shader918() {
    const r = './Models/EnvMaps/0/';
    const urls = [
        r + 'px.jpg',
        r + 'nx.jpg',
        r + 'py.jpg',
        r + 'ny.jpg',
        r + 'pz.jpg',
        r + 'nz.jpg'];

    const textureCube = new THREE.CubeTextureLoader().load(urls)
    const loader = new THREE.TextureLoader()
    const noiseTexture = loader.load('./Models/Textures/Colors/noiseTexture.png')
    noiseTexture.wrapS = THREE.MirroredRepeatWrapping
    noiseTexture.wrapT = THREE.MirroredRepeatWrapping

    const DPR = Math.min(window.devicePixelRatio, 1.);

    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_cameraPosition: { value: new THREE.Vector3() },
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { value: new THREE.Uniform(new THREE.Vector2()) },
            u_mouse2: { value: new THREE.Uniform(new THREE.Vector2()) },
            u_mouse3: { value: new THREE.Uniform(new THREE.Vector2()) },

            u_texture: { value: noiseTexture },
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
        if (meshRef.current) {
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

    useFrame(({ clock, camera }) => {
        material.uniforms.u_cameraPosition.value = camera.position
        material.uniforms.u_time.value = clock.elapsedTime - currentTime
        material.uniforms.u_mouse.value = new Vector2(mouseX, mouseY)
        material.uniforms.u_mouse2.value = new Vector2(mouseX2, mouseY2)
        material.uniforms.u_mouse3.value = new Vector2(mouseX3, mouseY3)
        meshRef.current.material.uniforms.u_resolution.value = new THREE.Vector2(
            dimensions.width * DPR,
            dimensions.height * DPR
        )

        mouseX = lerp(mouseX, tempValX, 0.01 * 4)
        mouseY = lerp(mouseY, tempValY, 0.01 * 4)

        mouseX2 = lerp(mouseX2, tempValX, 0.005 * 4)
        mouseY2 = lerp(mouseY2, tempValY, 0.005 * 4)

        mouseX3 = lerp(mouseX3, tempValX, 0.0025 * 4)
        mouseY3 = lerp(mouseY3, tempValY, 0.0025 * 4)

    })

    const remap = (value, low1, high1, low2, high2) => {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
    }

    addEventListener('mousemove', (e) => {
        if (e.clientX >= meshSizes.leftPixel && e.clientX <= meshSizes.rightPixel) {
            tempValX = remap(e.clientX, meshSizes.leftPixel, meshSizes.rightPixel, 0, 1)
        }
        if (e.clientY >= meshSizes.topPixel && e.clientY <= meshSizes.bottomPixel) {
            tempValY = remap(e.clientY, meshSizes.topPixel, meshSizes.bottomPixel, 1, 0)
        }
    })

    addEventListener('contextmenu', e => e.preventDefault())

    addEventListener('touchmove', (e) => {
        if (e.clientX >= meshSizes.leftPixel && e.clientX <= meshSizes.rightPixel) {
            tempValX = remap(e.clientX, meshSizes.leftPixel, meshSizes.rightPixel, 0, 1)
        }
        if (e.clientY >= meshSizes.topPixel && e.clientY <= meshSizes.bottomPixel) {
            tempValY = remap(e.clientY, meshSizes.topPixel, meshSizes.bottomPixel, 1, 0)
        }
    }, { passive: false })

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