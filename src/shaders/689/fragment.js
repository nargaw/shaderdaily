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
    varying vec4 vColor;
    
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numEight(vec2(p.x -0.03, p.y));
        float right = numNine(vec2(p.x - 0.42, p.y));
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

        // vec3 baseColor = vColor.xyz;

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

        //toon shading
        float toon = dp * (smoothstep(0.5, 0.501, dp));
        float partialToon = (smoothstep(0.66, 0.661, dp) * 0.5 + 0.5);
        toon = min(partialToon, toon);

        vec3 toonDiffuse = toon * lightColor;

        //phong specular
        vec3 r = normalize(reflect(-lightDirection, normal));
        float phongValue = max(0.0, dot(viewDir, r));
        phongValue = pow(phongValue, 128.0);
        vec3 specular = vec3(phongValue);

        //IBL Specular
        vec3 iblCoord = normalize(reflect(-viewDir, normal));
        vec3 iblSample = textureCube(u_background, iblCoord).xyz;

        //fresnel
        float fresnel = 1.0 - max(0.0, dot(viewDir, normal));
        fresnel = pow(fresnel, 2.0);
        // specular *= fresnel;
        fresnel *= step(0.7, fresnel);

        // specular += iblSample * 0.5;
        specular += phongValue;
        specular = smoothstep(0.5, 0.51, specular);


        lighting = ambientLight * 0. + hemi * 0.0 + diffuse * 0.8;

        // lighting = diffuse * 0.8;

        // color = baseColor;
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
varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 vColor;

//inverseLerp 
float inverseLerp(float v, float minVal, float maxVal){
    return (v - minVal) / (maxVal - minVal);
}

//remap
float remap(float v, float minIn, float maxIn, float minOut, float maxOut){
    float t = inverseLerp(v, minIn, maxIn);
    return mix(minOut, maxOut, t);
}

//rotate
mat3 rotateY(float radians)
{
    float s = sin(radians);
    float c = cos(radians);

    return mat3(
        c, 0.0, s,
        0.0, 1., 0.,
        -s, 0., c
    );
}

mat3 rotateZ(float radians)
{
    float s = sin(radians);
    float c = cos(radians);

    return mat3(
        c, -s, 0.,
        s, c, 0.,
        0., 0., 1.
    );
}

mat3 rotateX(float radians)
{
    float s = sin(radians);
    float c = cos(radians);

    return mat3(
        1., 0.0, 0.,
        0.0, c, -s,
        0., s, c
    );
}

uniform float u_time;


//easing functions
float easeOutBounce(float x){
    const float nl = 7.5625;
    const float dl = 2.75;

    if (x < 1. / dl){
        return nl * x * x;
    } else if (x < 2.0 / dl){
        x -= 1.5/ dl;
        return nl * x * x + 0.75;
    } else if (x < 2.5 / dl){
        x -= 2.25 / dl;
        return nl * x * x + 0.9375;
    } else {
        x -= 2.625 / dl;
        return nl * x * x + 0.984375;
    }
}

float easeInBounce(float x){
    return 1. - easeOutBounce(1. - x);
}

float easeInOutBounce(float x){
    return x < 0.5
    ? (1. - easeOutBounce(1. - 2. * x)) / 2.
    : (1. + easeOutBounce(2. * x - 1.)) / 2.;
}



void main()
{
    
    vec3 localSpacePosition = position;

    localSpacePosition *= easeOutBounce(clamp(u_time - 2., 0., 1.));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(localSpacePosition, 1.);
    vNormal = (modelMatrix * vec4(normal, 0.)).xyz;
    vUv = uv;
    vPosition = (modelMatrix * vec4(localSpacePosition, 1.)).xyz;

    // vec3 red = vec3(1., 0. , 0.);
    // vec3 blue = vec3(0., 0., 1.);

    // float t = remap(vPosition.x, -0.5, 0.5, 0.0, 1.);
    // t = pow(t, 2.);
    // vColor = vec4(mix(red, blue, t), t);
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

export default function Shader689()
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

    // const geometry = new THREE.PlaneGeometry(2., 2.)
    const geometry = new THREE.BoxGeometry(2., 2., 2., 5.);
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
            {/* <OrbitControls 
                enablePan = {false}
                maxAzimuthAngle={Math.PI * 0.5}
                minAzimuthAngle={-Math.PI * 0.5}
                maxPolarAngle={Math.PI * 0.5 } 
                minPolarAngle={-Math.PI * 0.5 }           
            /> */}
            <mesh 
                ref={meshRef} 
                scale={0.5} 
                geometry={suz.scene.children[0].geometry}
                // geometry={geometry}
                material={material}    
            />
        </>
    )
}