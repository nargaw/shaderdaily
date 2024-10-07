import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    // https://www.shadertoy.com/view/4dSfDK
    #define S(a, b, t) smoothstep(a, b, t)
    #define time u_time

    uniform sampler2D u_texture;
    uniform sampler2D u_texture2;
    uniform float u_waveFactor1;
    uniform float u_waveFactor2;
    uniform vec2 u_mouse2;
    uniform vec2 u_mouse3;

    float label(vec2 p)
    {
        p *= 10.;
        // p *= 0.01;
        p.x -= 0.25;
        // p = p +  vec2(7., 3.5);
        float left = numEight(vec2(p.x + 0.35, p.y));
        float center = numZero(vec2(p.x -0.03, p.y));
        float right = numEight(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    vec3 hsb2rgb( in vec3 c ){
        vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                                    6.0)-3.0)-1.0,
                            0.0,
                            1.0 );
        rgb = rgb*rgb*(3.0-2.0*rgb);
        return c.z * mix(vec3(1.0), rgb, c.y);
    }
    
    mat2 Rot(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }

    float rectOutline2(vec2 vUv, float height, float width)
    {
        float y = rect(vUv, height, width);
        float x = rect(vUv, height + 0.025, width + 0.025);
        return x-y;
    }

   

    void main()
    {
        vec2 coords = vUv;
        vec2 glowCoords = vUv;
        glowCoords = Rot(glowCoords, u_time);
        coords *= 2. - 1.;
        vec2 coords2 = coords;
        float noise = noise2D(coords + sin(u_time));
        float noiseTwo = noise2D(coords2 + sin(u_time));
        coords = coords;
        coords2 = coords2 + noiseTwo * 0.125;
        // coords = Rot(coords, sin(PI * 0.25));
        coords2 = Rot(coords2, sin(PI * 0.5));
        // coords *= 3. - 1.;
        vec3 color;

        float glowAmount = smoothstep(0.0, 0.75, glowCoords.x);
        glowAmount = 1.-pow(glowAmount, 1.5);
        vec3 glowColor = vec3((glowAmount * vec3(0.2, 0.5, 1.)) * 5.);

        vec3 texture = texture2D(u_texture, coords).rgb;

        color = texture;
        
        // color = texture * box;
        float numLabel = label(vUv);
        color = mix(color, vec3(1.), numLabel) ;
        
        gl_FragColor = vec4(color, 1.);
    }
`

const vertexShader = glsl`
varying vec2 vUv;
uniform float u_time;
uniform vec2 u_mouse;

 // Some useful functions
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
 // Ridged multifractal
 // See "Texturing & Modeling, A Procedural Approach", Chapter 12
 float ridge(float h, float offset) {
     h = abs(h);     // create creases
     h = offset - h; // invert so creases are at top
     h = h * h * h;      // sharpen creases
     return h;
 }

 float ridgedMF(vec2 p) {
     float lacunarity = 2.0 ;
     float gain = 0.25 ;
     float offset = .259;

     float sum = .0;
     float freq = 1.0; 
     float amp = 0.275;
     float prev = 1.0;
     for(int i=0; i < OCTAVES; i++) {
         //p *= 1.5;
         p.x += u_time * 0.2;
         float n = ridge(snoise(p*freq), offset);
         sum += n*amp;
         sum += n*amp*prev - snoise(p + u_time * 0.225);  // scale by previous octave
         prev = n;
         freq *= lacunarity;
         amp *= gain;
     }
     return sum;
 }

void main()
{
    vUv = uv;
    vec3 localSpacePosition = position;

    localSpacePosition.xy = localSpacePosition.xy + (ridgedMF(localSpacePosition.xy ) * 0.0125);
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
import { lerp } from 'three/src/math/MathUtils.js'
import { useControls } from 'leva'
import { Text } from '@react-three/drei'


export default function Shader808()
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
            u_texture: {value: night},
        },
    })

    const meshSize = 2

    const geometry = new THREE.PlaneGeometry(meshSize, meshSize, 256, 256)
    const meshRef = useRef()

     //mouse value 1
     let mouseX = 0;
     let mouseY = 0;

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
        meshRef.current.material.uniforms.u_resolution.value = new THREE.Vector2(
            dimensions.width * DPR,
            dimensions.height * DPR
        )

        mouseX = lerp(mouseX, tempValX, 0.06)
        mouseY = lerp(mouseY, tempValY, 0.06)
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