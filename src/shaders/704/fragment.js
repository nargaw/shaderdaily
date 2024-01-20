import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    #define time u_time

    uniform sampler2D u_texture;

    float label(vec2 p)
    {

        p *= 10.;
        // p *= 0.01;
        p.x -= 0.25;
        // p = p +  vec2(7., 3.5);
        float left = numSeven(vec2(p.x + 0.35, p.y));
        float center = numZero(vec2(p.x -0.03, p.y));
        float right = numFour(vec2(p.x - 0.42, p.y));
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


    void main()
    {
        vec2 coords = fract(vUv * vec2(2., 1.));
        coords.x = remap(coords.x, 0., 1., 0.25, 0.75);
        vec3 color;
       
        color = texture2D(u_texture, coords).rgb;

        if(vUv.x > 0.5){
            //tinting
            // vec3 tintColor = vec3(1., 0.5, 0.5);
            // color *= tintColor;

            //brightness
            // float brightnessAmount = 0.1;
            // color += brightnessAmount;

            //saturation
            float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
            float saturationAmount = 2.;
            // color = mix(vec3(luminance), color, saturationAmount);

            //contrast
            // float contrastAmount = 2.;
            // float midpoint = 0.5;
            // color = saturate3((color - midpoint) * contrastAmount + midpoint);
            // vec3 sg = sign(color - midpoint);
            // color = sg * pow(abs(color - midpoint) * 2.0, vec3(1./contrastAmount)) * 0.5 + midpoint;


            //matrixeffect
            // color = pow(color, vec3(1.5, 0.8, 1.5));

            //colorBoost
            // vec3 refColor = vec3(0.72, 0.25, 0.25);
            // float colorWeight = 1.0 - distance(color, refColor);
            // colorWeight = smoothstep(0.5, 1., colorWeight);
            // color = mix(vec3(luminance), color, colorWeight);

            //vector color boost
            // vec3 refColor = vec3(0.72, 0.25, 0.25);
            // float colorWeight = dot(normalize(color), normalize(refColor));
            // colorWeight = pow(colorWeight, 32.);
            // color = mix(vec3(luminance), color, colorWeight);

            //vignette
            vec2 vignetteCoords = fract(vUv * vec2(2., 1.));
            float v1 = smoothstep(0.5, 0.2, abs(vignetteCoords.x - 0.5));
            float v2 = smoothstep(0.5, 0.2, abs(vignetteCoords.y - 0.5));
            float vignetteAmount = v1 * v2;
            vignetteAmount = pow(vignetteAmount, 0.25);
            vignetteAmount = remap(vignetteAmount, 0., 1., 0.5, 1.);
            color *= vignetteAmount;

            //pixelation
            vec2 dims = vec2(64., 64.);
            vec2 texUv = floor(coords * dims) / dims;
            vec3 pixelated = texture2D(u_texture, texUv).xyz;
            color = pixelated;

        }

        float numLabel = label(vUv);
        color = mix(color, vec3(1.), numLabel) ;
        gl_FragColor = vec4(color, 1.);
    }
`

const vertexShader = glsl`
varying vec2 vUv;

void main()
{
    vUv = uv;
    vec3 localSpacePosition = position;
    // gl_Position = vec4(localSpacePosition, 1.);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(localSpacePosition, 1.);
}`

import { Vector2, ShaderMaterial } from 'three'
import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'
import * as THREE from 'three'
import { folder, useControls } from 'leva'
import { useGLTF, OrbitControls } from '@react-three/drei'

export default function Shader704()
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
    const frog = loader.load('./Models/Textures/photos/frog.jpg')

    
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader ,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_cameraPosition: {value: new THREE.Vector3()},
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { type: "v2", value: new Vector2() },
            u_texture: {value: frog}
        },
    })

    const geometry = new THREE.PlaneGeometry(2., 2.)
    // const geometry = new THREE.BoxGeometry(2., 2., 2., 5.);
    const icosaGeometry = new THREE.IcosahedronGeometry(1, 128)
    const meshRef = useRef()

    let mouseX;
    let mouseY;

    let currentTime = 0

    let sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
        // console.log(sizes.width, sizes.height)
    })
    
    useThree((state) => {
        currentTime = state.clock.elapsedTime
    })

    // useEffect(() => {
    //     sizes.width = window.innerWidth
    //     sizes.height = window.innerHeight
    //     console.log(sizes)
    // }, [window.innerWidth, window.innerHeight])
    
    useFrame(({clock, camera}) => {
        material.uniforms.u_cameraPosition.value = camera.position
        material.uniforms.u_time.value = clock.elapsedTime - currentTime
        material.uniforms.u_mouse.value = new Vector2(mouseX, mouseY)
        material.uniforms.u_resolution.value = new Vector2(sizes.width, sizes.height)
    })


    addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth);
        mouseY = -(e.clientY / window.innerHeight) + 1;
    })

    addEventListener('contextmenu', e => e.preventDefault())

    addEventListener('touchmove', (e) => {
        mouseX = (e.changedTouches[0].clientX / window.innerWidth);
        mouseY = -(e.changedTouches[0].clientY / window.innerHeight) + 1;
    }, {passive: false})




    return (
        <>
            <mesh 
                ref={meshRef} 
                // scale={0.5} 
                // geometry={suz.scene.children[0].geometry}
                // geometry={icosaGeometry}
                geometry={geometry}
                material={material}    
            />
        </>
    )
}