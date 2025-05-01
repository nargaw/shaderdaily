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
        float center = numZero(vec2(p.x -0.03, p.y));
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

    float sdfVesica(vec2 p, float w, float h)
    {
        float d = 0.5*(w*w-h*h)/h;
        p = abs(p);
        vec3 c = (w*p.y < d*(p.x-w)) ? vec3(0.0,w,0.0) : vec3(-d,0.0,d+h);
        float s = length(p-c.yx) - c.z;
        return s;
        // return smoothstep(s, s+0.01, 0.01);
    }

    float plotLine(vec2 p, float line, float thickness)
    {
        return line - p.y;
    }

    float lineSegment(vec2 p, vec2 a, vec2 b) {
        float thickness = 0.1/100.0;

        vec2 pa = p - a;
        vec2 ba = b - a;

        float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
        // ????????
        float idk = length(pa - ba*h);

        return idk;
    }
    
    float opOnion( in vec2 p, in float r, float sdf )
    {
    return abs(sdf) - r;
    }

    void main()
    {
        vec2 coords = vUv;
        vec3 color;
        vec2 numCoords = coords; 

        vec2 m = u_mouse;
        vec2 coords1 = coords;
        vec2 coords2 = coords;
        vec2 coords3 = coords;

        coords1 -= 0.5;
        coords2 = Rot(coords2, PI * 0.25 * (u_time));
        coords2 -= 0.5;

        coords3 = Rot(coords3, PI * 0.25 * (-u_time - 2.5));
        coords3 -= 0.5;

        float blendValue = 60.;
        float thicknessValue = 0.005;
        vec2 size = vec2(0.25);
        float b1 = sdfBox(coords1, size);
        b1 = opOnion(coords1, thicknessValue, b1);

        float b2 = sdfBox(coords2, size + sin(u_time * 0.25)/10.);
        b2 = opOnion(coords2, thicknessValue, b2);

        float b3 = sdfBox(coords3, size + cos(-u_time * 0.25)/10.);
        b3 = opOnion(coords3, thicknessValue, b3);

        float d = softMin(b1, softMin(b2, b3, blendValue), blendValue);

        color = mix(vec3(1., 0., 0.), color, smoothstep(0.0, 0.0125, d));
        color = mix(vec3(0.), color, smoothstep(0.0, 0.015, d));
        color *= 5.;

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

export default function Shader909() {
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
    const night = loader.load('./Models/Textures/photos/forest.jpg')
    night.wrapS = THREE.MirroredRepeatWrapping
    night.wrapT = THREE.MirroredRepeatWrapping

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

            u_texture: { value: night },
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