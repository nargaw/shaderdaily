import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    #define time u_time

    uniform sampler2D u_texture;
    uniform samplerCube u_background;

    float label(vec2 p)
    {

        p *= .01;
        p = p +  vec2(7., 3.5);
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numNine(vec2(p.x -0.03, p.y));
        float right = numSix(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    vec3 Y = vec3(1., 1., 0.5);
    vec3 B = vec3(0.25, 0.25, 1.);
    vec3 R = vec3(1., 0.25, 0.25);
    vec3 G = vec3(0.25, 1., 0.25);
    vec3 P = vec3(1., 0.25, 1.);

    float inverseLerp(float v, float minValue, float maxValue){
        return(v - minValue) / (maxValue - minValue);
    }

    float remap(float v, float inMin, float inMax, float outMin, float outMax)
    {
        float t = inverseLerp(v, inMin, inMax);
        return mix(outMin, outMax, t);
    }

    float sdfCircle(vec2 p, float r){
        return length(p) - r;
    }

    float sdfLine(vec2 p, vec2 a, vec2 b){
        vec2 pa = p - a;
        vec2 ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
        return  length(pa - ba * h);
    }

    float sdfBox(vec2 p, vec2 b){
        vec2 d = abs(p) -b;
        return length(max(d, 0.)) + min(max(d.x, d.y), 0.);
    }

    mat2 rotate2D(float angle){
        float s = sin(angle);
        float c = cos(angle);
        return mat2(c, -s, s, c);
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

    vec3 DrawBackground(vec2 vUv){

        vec3 morning = mix(
            vec3(0.44, 0.64, 0.84),
            vec3(0.34, 0.51, 0.94),
            smoothstep(0.0, 1.0, pow(vUv.x * vUv.y, 0.5))
        );
        
        vec3 midday = mix(
            vec3(0.42, 0.58, 0.75),
            vec3(0.36, 0.46, 0.82),
            smoothstep(0.0, 1.0, pow(vUv.x * vUv.y, 0.5))
        );

        vec3 evening = mix(
            vec3(0.82, 0.51, 0.25),
            vec3(0.88, 0.71, 0.39),
            smoothstep(0.0, 1.0, pow(vUv.x * vUv.y, 0.5))
        );

        vec3 night = mix(
            vec3(0.07, 0.1, 0.19),
            vec3(0.19, 0.2, 0.29),
            smoothstep(0.0, 1.0, pow(vUv.x * vUv.y, 0.5))
        );

        float dayLength = 10.0;
        float dayTime = mod(time, dayLength);

        vec3 color;
        if(dayTime < dayLength * 0.25){
            color = mix(morning, midday, smoothstep(0., dayLength * 0.25, dayTime));
        } else if(dayTime < dayLength * 0.5){
            color = mix(midday, evening, smoothstep(dayLength * 0.25, dayLength * 0.5, dayTime));
        } else if(dayTime < dayLength * 0.75){
            color = mix(evening, night, smoothstep(dayLength * 0.5, dayLength * 0.75, dayTime));
        }else {
            color = mix(night, morning, smoothstep(dayLength * 0.75, dayLength, dayTime));
        }

        return color;
    }

    float sdfCloud(vec2 pixelCoords)
    {
        float puff1 = sdfCircle(pixelCoords, 100.0);
        float puff2 = sdfCircle(pixelCoords - vec2(120.0, -10.0), 80.0);
        float puff3 = sdfCircle(pixelCoords + vec2(120.0, 10.), 80.0);

        return min(puff1, min(puff2, puff3));
    }

    float hash(vec2 v)
    {
        float t = dot(v, vec2(47.37468, 132.4857943));
        return sin(t);
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
        vec2 pixelCoords = (vUv) * u_resolution;
        vec3 color = vec3(0.);

        color = DrawBackground(vUv);

        const float NUM_CLOUDS = 8.0;
        for(float i = 0.; i < NUM_CLOUDS; i += 1.0)
        {
            float size = mix(2., 1., (i / NUM_CLOUDS) + 0.1 * hash(vec2(i)));
            float speed = size * 0.25;
            vec2 offset = vec2(i * 200. + time * 100., 200. * hash(vec2(i)));
            vec2 pos = pixelCoords - offset;

            pos = mod(pos, u_resolution);
            pos = pos - u_resolution * 0.5;

            float cloud = sdfCloud(pos * size);
            float cloudShadow = sdfCloud(pos * size + vec2(25.)) - 50.;

            color = mix(color, vec3(0.), 0.5 * smoothstep(0., -100., cloudShadow));
            color = mix(vec3(1.), color, smoothstep(0., 1., cloud));
        }

        
        
        
        float numLabel = label(pixelCoords);
        color = mix(color, vec3(0.), numLabel) ;
        gl_FragColor = vec4(color, 1.);
    }
`

const vertexShader = glsl`
varying vec2 vUv;

void main()
{
    vUv = uv;
    vec3 localSpacePosition = position;
    gl_Position = vec4(localSpacePosition, 1.);
    // gl_Position = projectionMatrix * modelViewMatrix * vec4(localSpacePosition, 1.);
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

export default function Shader696()
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

    const tvTexture = loader.load('./Models/Textures/TV/tv.jpg')

    const suz = useGLTF('./Models/suzanne/suz.glb')
    const testMaterial = new THREE.MeshNormalMaterial()
    
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader ,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_cameraPosition: {value: new THREE.Vector3()},
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { type: "v2", value: new Vector2() },
            u_texture: {value: tvTexture},
            u_background: {value: textureCube}
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