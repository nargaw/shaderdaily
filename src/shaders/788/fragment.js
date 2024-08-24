import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    #define time u_time

    uniform vec2 u_mouse2;
    uniform vec2 u_mouse3;
    uniform sampler2D u_texture;
    uniform vec3 u_color;

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
     
        vec3 color = vec3(1., 0., 1.);
        vec2 m = u_mouse.xy;
        vec2 offset  =  vec2(u_mouse.xy);  
        vec2 offset2 = vec2(u_mouse2.xy); 
        vec2 offset3 = vec2(u_mouse3.xy);

        float textureAlpha = texture(u_texture, gl_PointCoord).r;

        // float numLabel = label(vUv);
        // color = mix(color, vec3(1.), numLabel) ;

        gl_FragColor = vec4(u_color, textureAlpha);
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
uniform float u_progress;

attribute float aSize;
attribute float aTimeMultiplier;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main()
{
    float progress = u_progress * aTimeMultiplier;
    vec3 newPosition = position;

    //exploding
    float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
    explodingProgress = clamp(explodingProgress, 0., 1.);
    explodingProgress = 1. - pow(1.0 - explodingProgress, 3.);
    newPosition *= explodingProgress;

    //falling
    float fallingProgress = remap(progress, 0.1, 1., 0., 1.);
    fallingProgress = clamp(fallingProgress, 0., 1.);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.);
    newPosition.y -= fallingProgress * 0.2;

    //scaling
    float sizeOpeningProgress = remap(progress, 0., 0.125, 0., 1.);
    float sizeclosingProgress = remap(progress, 0.125, 1.0, 1.0, 0.0);
    float sizeProgress = min(sizeOpeningProgress, sizeclosingProgress);
    sizeProgress = clamp(sizeProgress, 0., 1.);

    //twinkling
    float twinklingProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
    twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);
    float sizeTwinkling = sin(progress * 30.) * 0.5 + 0.5;
    sizeTwinkling = 1. - sizeTwinkling * twinklingProgress;

    //final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    //final size
    gl_PointSize = u_size * u_resolution.y * aSize * sizeProgress * sizeTwinkling;
    gl_PointSize *= 1.0 / - viewPosition.z;

    if(gl_PointSize < 1.){
        gl_Position = vec4(9999.9);
    } 
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
import gsap from 'gsap'


export default function Shader788()
{
    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
        pixelRatio: Math.min(window.devicePixelRatio, 2)
    }
    sizes.resolution = new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)

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
    
    const createFirework = () => {
        
        const count = Math.round(400 + Math.random() * 1000)
        const position = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            Math.random(),
            (Math.random() - 0.5) * 2
        )
        const size = 0.1 + Math.random() * 0.1
        const texture = textures[Math.floor(Math.random() * textures.length)]
        texture.flipY = false
        const radius = 0.5 + Math.random()
        const color = new THREE.Color()
        color.setHSL(Math.random(), 1, 0.7)

        //geometry
        const positionsArray = new Float32Array(count * 3)
        const sizesArray = new Float32Array(count)
        const timeMultipliersArray = new Float32Array(count)

        for(let i = 0; i < count; i++)
        {
            const i3 = i * 3

            const spherical = new THREE.Spherical(
                radius * (0.75 + Math.random() * 0.25),
                Math.random() * Math.PI,
                Math.random() * Math.PI * 2
            )
            const position = new THREE.Vector3()
            position.setFromSpherical(spherical)

            positionsArray[i3    ] = position.x
            positionsArray[i3 + 1] = position.y
            positionsArray[i3 + 2] = position.z

            sizesArray[i] = Math.random()

            timeMultipliersArray[i] = 1 + Math.random()
        }
        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3))
        geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray, 1))
        geometry.setAttribute('aTimeMultiplier', new THREE.Float32BufferAttribute(timeMultipliersArray, 1))

        // Material
        
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
            uniforms:
            {
                u_size: new THREE.Uniform(size),
                u_resolution: new THREE.Uniform(sizes.resolution),
                u_texture: new THREE.Uniform(texture),
                u_color: new THREE.Uniform(color),
                u_progress: new THREE.Uniform(0)
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        })

        const{ scene } = useThree()
        const firework = new THREE.Points(geometry, material)
        firework.position.copy(position)
        scene.add(firework)
        
        // Destroy
        const destroy = () =>
        {
            scene.remove(firework)
            geometry.dispose()
            material.dispose()
        }
    
        // Animate
        gsap.to(
            material.uniforms.u_progress,
            { value: 1, ease: 'linear', duration: 3, onComplete: destroy },
        )
    }

    createFirework()

    return (
        <>
            
        </>
    )
}