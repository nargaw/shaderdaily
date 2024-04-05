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
        float right = numEight(vec2(p.x - 0.42, p.y));
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

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    //
    // Description : GLSL 2D simplex noise function
    //      Author : Ian McEwan, Ashima Arts
    //  Maintainer : ijm
    //     Lastmod : 20110822 (ijm)
    //     License :
    //  Copyright (C) 2011 Ashima Arts. All rights reserved.
    //  Distributed under the MIT License. See LICENSE file.
    //  https://github.com/ashima/webgl-noise
    //
    float snoise(vec2 v) {
    
        // Precompute values for skewed triangular grid
        const vec4 C = vec4(0.211324865405187,
                            // (3.0-sqrt(3.0))/6.0
                            0.366025403784439,
                            // 0.5*(sqrt(3.0)-1.0)
                            -0.577350269189626,
                            // -1.0 + 2.0 * C.x
                            0.024390243902439);
                            // 1.0 / 41.0
    
        // First corner (x0)
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
    
        // Other two corners (x1, x2)
        vec2 i1 = vec2(0.0);
        i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
        vec2 x1 = x0.xy + C.xx - i1;
        vec2 x2 = x0.xy + C.zz;
    
        // Do some permutations to avoid
        // truncation effects in permutation
        i = mod289(i);
        vec3 p = permute(
                permute( i.y + vec3(0.0, i1.y, 1.0))
                    + i.x + vec3(0.0, i1.x, 1.0 ));
    
        vec3 m = max(0.5 - vec3(
                            dot(x0,x0),
                            dot(x1,x1),
                            dot(x2,x2)
                            ), 0.0);
    
        m = m*m ;
        m = m*m ;
    
        // Gradients:
        //  41 pts uniformly over a line, mapped onto a diamond
        //  The ring size 17*17 = 289 is close to a multiple
        //      of 41 (41*7 = 287)
    
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
    
        // Normalise gradients implicitly by scaling m
        // Approximation of: m *= inversesqrt(a0*a0 + h*h);
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);
    
        // Compute final noise value at P
        vec3 g = vec3(0.0);
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
        return 130.0 * dot(m, g);
    }
    
    #define OCTAVES 6
    
    float ridge(float h, float offset) {
        h = abs(h);     // create creases
        h = offset - h; // invert so creases are at top
        h = h * h;      // sharpen creases
        return h;
    }
    
    float fbm(vec2 vUv){
        float lacunarity = 2.0;
        float gain = 0.15;
        float offset = 0.9;
        float amp = 0.5;
        float sum = 0.0;
        float freq = 1.0; 
        float prev = 1.0;
        for( int i = 0; i < OCTAVES; i++){
            float v = ridge(snoise(vUv * freq), offset * sin(snoise(vUv + (u_time * 0.25))));
            sum += v *amp;
            sum += v * amp * prev;
            prev = v;
            freq *= lacunarity;
            amp *= gain;
        }
        return sum;
    }

    float opUnion(float d1, float d2)
    {
        return min(d1, d2);
    }

    float opSubtraction(float d1, float d2){
        return max(-d1, d2);
    }

    float opIntersection(float d1, float d2){
        return max(d1, d2);
    }

    float softMax(float a, float b, float k)
    {
        return log(exp(k * a) + exp(k * b)) / k;
    }

    float softMin(float a, float b, float k)
    {
        return -softMax(-a, -b, k);
    }

    float softMinValue(float a, float b, float k)
    {
        float h = exp(-b * k) / (exp(-a * k) + exp(-b * k));
        // float h = remap(a - b, -1.0/ k, 1.0 / k, 0., 1.);
        return h;
    }

    void main()
    {
        vec2 coords = vUv;

        vec3 color = vec3(0.);
        

        vec2 newCoords = coords ;
        vec2 m = u_mouse.xy;

        vec2 offset = vec2(m) - 0.5  ;

        color = texture2D(u_texture, coords).rgb;
        

        float f = fbm(newCoords * 1.) * 1.5;
        // f = remap(f, 0., 1., 0.25, 0.75);
        // vec3 circleColor = texture2D(u_texture, coords + f * 0.01).rgb * 2.;
        vec3 circleColor = texture2D(u_texture, coords + f * 0.01).rgb;

        //saturation
        float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
        float saturationAmount = 3.;
        // circleColor = mix(vec3(luminance), circleColor, saturationAmount);

        //contrast
        // float contrastAmount = 2.;
        // float midpoint = 0.5;
        // color = saturate3((color - midpoint) * contrastAmount + midpoint);
        // vec3 sg = sign(color - midpoint);
        // color = sg * pow(abs(color - midpoint) * 2.0, vec3(1./contrastAmount)) * 0.5 + midpoint;


        //matrixeffect
        // circleColor = pow(circleColor, vec3(1.5, 0.8, 1.5));

        //colorBoost
        // vec3 refColor = vec3(0.72, 0.25, 0.25);
        // float colorWeight = 1.0 - distance(color, refColor);
        // colorWeight = smoothstep(0.5, 1., colorWeight);
        // color = mix(vec3(luminance), color, colorWeight);

        float circle = 1. - distance(newCoords - offset, vec2(0.5));
        circle = smoothstep(0.2, 0.41, circle);

        float d = softMin(color.x, circle, 0.15);
        // color = vec3(d);
        
        color = mix(color, circleColor, circle);
         
        float numLabel = label(vUv);
        color = mix(color, vec3(0.), numLabel) ;
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
import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'
import * as THREE from 'three'
import { useControls } from 'leva'
import { Text } from '@react-three/drei'


export default function Shader728()
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
    const banksy = loader.load('./Models/Textures/photos/banksy.jpg')
    // threeLogo.wrapS = THREE.MirroredRepeatWrapping
    // threeLogo.wrapT = THREE.MirroredRepeatWrapping

    const DPR = Math.min(window.devicePixelRatio, 1.);

    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader ,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_cameraPosition: {value: new THREE.Vector3()},
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { type: "v2", value: new Vector2() },
            u_texture: {value: banksy},
        },
    })

    const meshSize = 2

    const geometry = new THREE.PlaneGeometry(meshSize, meshSize, 256, 256)
    const meshRef = useRef()

    let mouseX;
    let mouseY;

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
        meshRef.current.material.uniforms.u_resolution.value = new THREE.Vector2(
            dimensions.width * DPR,
            dimensions.height * DPR
        )
    })

    const remap = (value, low1, high1, low2, high2 ) => {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
    }

    addEventListener('mousemove', (e) => {
        if(e.clientX >= meshSizes.leftPixel && e.clientX <= meshSizes.rightPixel){
            mouseX = remap(e.clientX, meshSizes.leftPixel, meshSizes.rightPixel, 0, 1)
        }
        if(e.clientY >= meshSizes.topPixel && e.clientY <= meshSizes.bottomPixel){
            mouseY = remap(e.clientY, meshSizes.topPixel, meshSizes.bottomPixel, 1, 0)
        }
    })

    addEventListener('contextmenu', e => e.preventDefault())

    addEventListener('touchmove', (e) => {
        if(e.clientX >= meshSizes.leftPixel && e.clientX <= meshSizes.rightPixel){
            mouseX = remap(e.clientX, meshSizes.leftPixel, meshSizes.rightPixel, 0, 1)
        }
        if(e.clientY >= meshSizes.topPixel && e.clientY <= meshSizes.bottomPixel){
            mouseY = remap(e.clientY, meshSizes.topPixel, meshSizes.bottomPixel, 1, 0)
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