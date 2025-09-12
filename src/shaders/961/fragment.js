import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    
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
        float center = numSix(vec2(p.x -0.03, p.y));
        float right = numOne(vec2(p.x - 0.42, p.y));
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
    
    float opOnion(float sdf, float r)
    {
    return abs(sdf) - r;
    }

    vec2 toPolarCoords(vec2 coords, float time) {
        float radius = length(coords); //get euclidean distance
        float angle = atan(coords.y, coords.x); //get angle in radians
        angle = abs(angle) * 0.3;
        vec2 polarCoords = vec2(0.15/radius + time * 0.095, angle / PI  ); //polar coordinate as (radius, angle)
        return polarCoords;
    }

    float sdPoly(vec2 p, int sides, float scale)
    {
        float angle = atan(p.x, p.y) + PI;
        float radius = TWO_PI/float(sides);
        float d = cos(floor(.5 + angle/ radius) * radius - angle) * length(p);
        return d;
    }

    float rand(float x){
        return fract(sin(x + sin(u_time * 0.0001))* 1e4);
    }
    
    float plot(vec2 vUv, float pct){
        return abs(vUv.y - pct);
    }

    #define S(a, b, t) smoothstep(a, b, t)

    float DistLine(vec2 p, vec2 a, vec2 b)
    {
        vec2 pa = p - a;
        vec2 ba = b - a;
        float t = clamp(dot(pa, ba)/ dot(ba, ba), 0., 1.);
        return length(pa - ba * t);
    }

    float N21(vec2 p)
    {
        p = fract(p * vec2(445.23, 789.92));
        p += dot(p, p + 54.23 );
        return fract(p.x * p.y);
    }

    vec2 N22(vec2 p)
    {
        float n = N21(p);
        return vec2(n, N21(p + n));
    }

    vec2 GetPos(vec2 id, vec2 offset)
    {
        vec2 n = N22(id+offset) * u_time;
        // float x = sin(u_time* n.x);
        // float y = cos(u_time*n.y);
        return offset + sin(n) * .4;
    }

    float Line(vec2 p, vec2 a, vec2 b)
    {
        float d = DistLine(p, a, b);
        float m = S(.03, 0.01, d);
        m *= S(1.0, .5, length(a -b));
        return m;
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
        vec3 color;
        vec2 numCoords = coords; 

        vec2 mouse = u_mouse;

        vec2 coords1 = coords;
        coords1 -= 0.7;
        vec2 coords2 = coords;
        coords2.x -= 0.3;
        coords2.y -= 0.7;
        vec2 coords3 = coords;
        coords3.x -= 0.5;
        coords3.y -= 0.25;
        vec2 coords4 = coords;
        coords4 = Rot(coords4, u_time * 1.5);
        coords4 -= 0.5;

        float c1 = length(coords1) - 0.1;

        float c2 = length(coords2) - 0.1;

        float c3 = length(coords3) - 0.1;

        float r1 = sdfBox(coords4, vec2(0.2, 0.05));

        float cTot = opUnion(c1, opUnion(c2, c3));

        float f = softMin(c1, r1, 15.);
        float f2 = softMin(c2, r1, 15.);
        float f3 = softMin(c3, r1, 15.);

        vec3 green = vec3(0., 1., 0.);
        vec3 red = vec3(1., 0., 0.);
        vec3 blue = vec3(0., 0., 1.);

        vec3 sdfColor = mix(green, red, smoothstep(0., 1., softMinValue(c1, r1, 15.)));
        vec3 sdfColor2 = mix(blue, red, smoothstep(0., 1., softMinValue(c2, r1, 15.)));
        vec3 sdfColor3 = mix(vec3(1., 1., 0.), red, smoothstep(0., 1., softMinValue(c3, r1, 15.)));

        float glowAmount = smoothstep(0., 0.015, abs(f));
        glowAmount = 1. - pow(glowAmount, 0.05 * 2. * abs(sin(u_time * 0.95)/2. + 1.25));
        color += sdfColor * glowAmount * 0.5;

        float glowAmount2 = smoothstep(0., 0.015, abs(f2));
        glowAmount2 = 1. - pow(glowAmount2, 0.05 * 2. * abs(sin(u_time * 0.95 + 2.)/2. + 1.25));
        color += sdfColor2 * glowAmount2 * 0.5;

        float glowAmount3 = smoothstep(0., 0.015, abs(f3));
        glowAmount3 = 1. - pow(glowAmount3, 0.05 * 2. * abs(sin(u_time * 0.95 + 4.)/2. + 1.25));
        color += sdfColor3 * glowAmount3 * 0.5;
        float numLabel = label(numCoords);

        color = pow(color, vec3(0.4545));
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

export default function Shader961() {
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
    const eth = loader.load('./Models/Textures/photos/eth.jpg')
    // sys.wrapS = THREE.MirroredRepeatWrapping
    // sys.wrapT = THREE.MirroredRepeatWrapping

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

            u_texture: { value: eth },
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