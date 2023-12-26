import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    #define grid 10.
    #define time u_time

    uniform sampler2D u_texture;
    uniform samplerCube u_background;
    uniform vec3 u_cameraPosition;

    varying vec3 vNormal;
    varying vec3 vPosition;
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numEight(vec2(p.x -0.03, p.y));
        float right = numFour(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    //inverseLerp 
    float inverseLerp(float v, float minVal, float maxVal){
        return (v - minVal) / (maxVal - minVal);
    }

    //remap
    float remap(float v, float minIn, float maxIn, float minOut, float maxOut){
        float t = inverseLerp(v, minIn, maxIn);
        return mix(minOut, maxOut, t);
    }

    //linear to sRGB
    vec3 linearTosRGB(vec3 value){
        vec3 lt = vec3(lessThanEqual(value.rgb, vec3(0.0031308)));
        vec3 v1 = value * 12.92;
        vec3 v2 = pow(value.xyz, vec3(0.41666)) * 1.055 - vec3(0.055);
        return mix(v2, v1, lt);
    }


    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
        vec3 color = vec3(0.);
        // uv2 -= 0.5;

        vec3 viewDir = normalize(u_cameraPosition - vPosition);

        vec3 baseColor = vec3(0.5);
        vec3 lighting = vec3(0.);

        vec3 normal = normalize(vNormal);

        //ambient
        vec3 ambientLight = vec3(0.5);

        //hemiLighting
        vec3 skyColor = vec3(0., 0.3, 0.6);
        vec3 groundColor = vec3(0.6, 0.3, 0.1);
        float hemiMix = remap(normal.y, -1., 1., 0., 1.);
        vec3 hemi = mix(groundColor, skyColor, hemiMix);

        //Lambertian lighting
        vec3 lightDirection = normalize(vec3(1.));
        vec3 lightColor = vec3(1., 1., 0.9);
        float dp = max(0., dot(lightDirection, normal));
        vec3 diffuse = dp * lightColor;

        //phong specular
        vec3 r = normalize(reflect(-lightDirection, normal));
        float phongValue = max(0.0, dot(viewDir, r));
        phongValue = pow(phongValue, 32.0);
        vec3 specular = vec3(phongValue);

        lighting = ambientLight * 0. + hemi * 0.0 + diffuse * 1.;

        color = baseColor * lighting + specular;

        // color = normal;

        // color = linearTosRGB(color);
        color = pow(color, vec3(1./2.2));
        
        // float numLabel = label(vUv);
        // color = mix(color, vec3(1.), numLabel) ;
        gl_FragColor = vec4(color, 1.);
    }
`

const vertexShader = glsl`
varying vec2 vUv;
attribute vec3 newColors;

varying vec3 vNormal;

varying vec3 vColor;
varying vec3 vPosition;
void main()
{
    vColor = newColors;
    
    // gl_Position = vec4(position, 1.);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    vNormal = (modelMatrix * vec4(normal, 0.)).xyz;
    vUv = uv;
    vPosition = (modelMatrix * vec4(position, 1.)).xyz;
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

export default function Shader684()
{
    const r = './Models/EnvMaps/1/';
    const urls = [ r + 'px.png', r + 'nx.png',
    r + 'py.png', r + 'ny.png',
    r + 'pz.png', r + 'nz.png' ];

    const textureCube = new THREE.CubeTextureLoader().load(urls)

    const loader = new THREE.TextureLoader()

    const tvTexture = loader.load('./Models/Textures/TV/tv.jpg')

    const suz = useGLTF('./Models/suzanne/suz.glb')
    const testMaterial = new THREE.MeshNormalMaterial()
    
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_cameraPosition: {value: new THREE.Vector3()},
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(window.innerWidth, window.inner) },
            u_mouse: { type: "v2", value: new Vector2() },
            u_texture: {value: tvTexture},
            u_background: {value: textureCube}
        },
    })

    const geometry = new THREE.PlaneGeometry(2., 2.)
    const icosaGeometry = new THREE.IcosahedronGeometry(1, 128)
    const meshRef = useRef()

    let mouseX;
    let mouseY;

    let currentTime = 0
    
    useThree((state) => {
        currentTime = state.clock.elapsedTime
    })
    
    useFrame(({clock, camera}) => {
        // meshRef.current.rotation.y += 0.01
        material.uniforms.u_cameraPosition.value = camera.position
        material.uniforms.u_time.value = clock.elapsedTime - currentTime
        material.uniforms.u_mouse.value = new Vector2(mouseX, mouseY)
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
            <OrbitControls 
                enablePan = {false}
                maxAzimuthAngle={Math.PI * 0.5}
                minAzimuthAngle={-Math.PI * 0.5}
                maxPolarAngle={Math.PI * 0.5 } 
                minPolarAngle={-Math.PI * 0.5 }           
            />
            <mesh 
                ref={meshRef} 
                scale={0.5} 
                geometry={suz.scene.children[0].geometry}
                // geometry={icosaGeometry}
                material={material}    
            />
        </>
    )
}