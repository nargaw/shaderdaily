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
        float right = numFour(vec2(p.x - 0.42, p.y));
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

    vec3 bkGroundColor(){
        float distFromCenter = length(abs(vUv - 0.5));

        float vignette = 1. - distFromCenter;
        vignette = smoothstep(0.0, 0.7, vignette);
        vignette = remap(vignette, 0., 1., 0.3, 1.);

        return vec3(vignette);
    }

    vec3 drawGrid(vec3 color, vec3 lineColor, float cellSpacing, float lineWidth){
        vec2 center = vUv - 0.5;
        vec2 cells = abs(fract(center * u_resolution/cellSpacing) - 0.5);
        float distToEdge = (0.5 - max(cells.x, cells.y)) * cellSpacing;
        float lines = smoothstep(0., lineWidth, distToEdge);

        color = mix(lineColor, color, lines);
        return color;
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

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
        vec2 pixelCoords = (vUv - 0.5) * u_resolution;
        vec3 color = vec3(0.);

        color = bkGroundColor();
        color = drawGrid(color, vec3(0.5), 10., 1.);
        color = drawGrid(color, vec3(0.0), 100., 2.);


        //boolean operations
        vec2 p1 = pixelCoords - vec2(-300., -150.);
        vec2 p2 = pixelCoords - vec2(300., -150.);
        vec2 p3 = pixelCoords - vec2(0., 200.);
        
        float d1 = sdfCircle(p1, 150.0);
        float d2 = sdfCircle(p2, 150.0);
        float d3 = sdfCircle(p3, 150.0);


        vec2 b1Rot = (pixelCoords - vec2(0., -50.)) * rotate2D(time * 1.5);
        float box = sdfBox(b1Rot, vec2(200., 25.));

        float d = opUnion(opUnion(d1, d2), d3);
        // d = opSubtraction(box, d);
        
        vec3 sdfColor = mix(R, B, smoothstep(0., 1., softMinValue(box, d, 0.005)));
        
        d = softMin(box, d, 0.05);



        color = mix(sdfColor * 0.5, color, smoothstep(-1.0, 1., d));
        color = mix(sdfColor, color, smoothstep(-5.0, 0., d));



        // //antialiasing and shading
        // float d = sdfCircle(pixelCoords, 250.);
        // color = mix(R * 0.5, color, smoothstep(-1.0, 1., d));
        // color = mix(R, color, smoothstep(-5.0, 0., d));

        // //transformations
        // vec2 pos = pixelCoords - vec2(200., 300.);
        // pos *= rotate2D(u_time * 0.5);
        // float d = sdfBox(pos, vec2(200., 50.));
        // color = mix(R, color, step(0., d));
        
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

export default function Shader694()
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
        console.log(sizes.width, sizes.height)
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