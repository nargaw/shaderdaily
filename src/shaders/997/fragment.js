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
        float center = numNine(vec2(p.x -0.03, p.y));
        float right = numSeven(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    float inverseLerp(float v, float minValue, float maxValue) {
       return (v - minValue) / (maxValue - minValue);
    }

    float remap(float v, float inMin, float inMax, float outMin, float outMax) {
        float t = inverseLerp(v, inMin, inMax);
        return mix(outMin, outMax, t);
    }

 // 2D Random
    float random (in vec2 st) {
        return fract(sin(dot(st.xy,
                            vec2(12.9898,78.233)))
                    * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float cnoise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Smooth Interpolation

        // Cubic Hermine Curve.  Same as SmoothStep()
        vec2 u = f*f*(3.0-2.0*f);
        // u = smoothstep(0.,1.,f);

        // Mix 4 coorners percentages
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
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

    float sdPoly(vec2 p, int sides)
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
        float m = S(.002, 0.01, d);
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
        vec2 mouse2 = u_mouse2;
        vec2 mouse3 = u_mouse3;

        float cTot = 1.;
        vec3 sdfColor =  vec3(1., 0., 0.);
        coords.y += 0.1;
        vec2 coords1 = vec2(coords.x, coords.y) * 2.0- 0.5;
        coords1 -= 0.5;
        // coords1 *= 0.025;
        vec3 c1Color = vec3(0., 0., 1.);
        float c1 = sdfCircle(coords1, 0.25);
        vec3 sdfColor1 = mix(c1Color, vec3(0.), softMinValue(c1, cTot, 15.));
        cTot = softMin(c1, cTot, 25.);        
        color = mix(sdfColor1, color, smoothstep(0., 0.02, c1));

        vec2 coords2 = vec2(coords.x, coords.y) * 2.0- 0.5;
        // coords2 = Rot(coords2, u_time);
        coords2 -= 0.5;
        coords2.y -= 0.5;
        coords2.x -= 0.5;
        vec3 c2Color = vec3(1., 0., 0.);
        float c2 = sdfCircle(coords2, 0.15);
        vec3 sdfColor2 = mix(c2Color, sdfColor1, softMinValue(c2, cTot, 15.));
        cTot = softMin(c2, cTot, 25.);        
        color = mix(sdfColor2, color, smoothstep(0., 0.02, cTot));

        vec2 coords3 = vec2(coords.x, coords.y) * 2.0- 0.5;
        coords3 -= 0.5;
        coords3.y -= 0.5;
        coords3.x += 0.5;
        vec3 c3Color = vec3(1., 0., 0.);
        float c3 = sdfCircle(coords3, 0.15);
        vec3 sdfColor3 = mix(c3Color, sdfColor2, softMinValue(c3, cTot, 15.));
        cTot = softMin(c3, cTot, 25.);        
        color = mix(sdfColor3, color, smoothstep(0., 0.01, cTot));

        vec2 coords4 = vec2(coords.x, coords.y) * 2.0- 0.5;
        coords4 = Rot(coords4, PI * 0.25);
        coords4 -= 0.5;
        coords4.x -= 0.4;
        vec3 c4Color = vec3(1., 1., 0.);
        float c4 = sdfBox(coords4, vec2(0.25, 0.02));
        vec3 sdfColor4 = mix(c4Color, sdfColor3, softMinValue(c4, cTot, 15.));
        cTot = softMin(c4, cTot, 25.);        
        color = mix(sdfColor4, color, smoothstep(0., 0.01, cTot));

        vec2 coords5 = vec2(coords.x, coords.y) * 2.0- 0.5;
        coords5 = Rot(coords5, -PI * 0.25);
        coords5 -= 0.5;
        coords5.x += 0.4;
        vec3 c5Color = vec3(1.0, 1.0, 0.0);
        float c5 = sdfBox(coords5, vec2(0.25, 0.02));
        vec3 sdfColor5 = mix(c5Color, sdfColor4, softMinValue(c5, cTot, 15.));
        cTot = softMin(c5, cTot, 25.);        
        color = mix(sdfColor5, color, smoothstep(0., 0.01, cTot));

        vec2 coords6 = vec2(coords.x, coords.y) * 2.0- 0.5;
        coords6 -= 0.5;
        coords6.x -= 0.5;
        coords6.y -= 0.5;
        vec3 c6Color = vec3(1.);
        float c6 = sdfCircle(coords6, 0.1);
        vec3 sdfColor6 = mix(c6Color, sdfColor5, softMinValue(c6, cTot, 15.));
        cTot = softMin(c6, cTot, 25.);        
        color = mix(c6Color, color, smoothstep(0., 0.01, c6));

        vec2 coords7 = vec2(coords.x, coords.y) * 2.0- 0.5;
        coords7 -= 0.5;
        coords7.x -= 0.5;
        coords7.y -= 0.5;
        vec3 c7Color = vec3(0.);
        float c7 = sdfCircle(coords7, 0.05);
        vec3 sdfColor7 = mix(c7Color, sdfColor6, softMinValue(c7, cTot, 15.));
        cTot = softMin(c7, cTot, 25.);        
        color = mix(c7Color, color, smoothstep(0., 0.01, c7));

        vec2 coords8 = vec2(coords.x, coords.y) * 2.0 - 1.0;
        coords8.x += 0.5;
        coords8.y -= 0.5;
        vec3 c8Color = vec3(1.);
        float c8 = sdfCircle(coords8, 0.1);
        color = mix(c8Color, color, smoothstep(0., 0.01, c8));

        vec2 coords9 = vec2(coords.x, coords.y) * 2.0 - 1.0;
        coords9.x += 0.5;
        coords9.y -= 0.5;
        vec3 c9Color = vec3(0.);
        float c9 = sdfCircle(coords9, 0.05);
        color = mix(c9Color, color, smoothstep(0., 0.01, c9));

        vec2 coords10 = vec2(coords.x, coords.y) * 2.0 - 1.0;
        coords10.y -= 0.0;
        vec3 c10Color = vec3(0.);
        float c10 = sdfCircle(coords10, 0.02);
        color = mix(c10Color, color, smoothstep(0., 0.01, c10));

        vec2 coords11 = vec2(coords.x, coords.y) * 2.0 - 1.0;
        coords11.y += 0.15;
        vec3 c11Color = vec3(1.);
        float c11 = sdfVesica(coords11, 0.1, 0.05);
        color = mix(c11Color, color, smoothstep(0., 0.01, c11));

        vec2 coords12 = vec2(coords.x, coords.y) * 2.0 - 1.0;
        coords12.y += 0.15;
        vec3 c12Color = vec3(0.);
        float c12 = sdfVesica(coords12, 0.09, 0.04);
        color = mix(c12Color, color, smoothstep(0., 0.01, c12));

        color = pow(color, vec3(0.4545));
        
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

export default function Shader997() {
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

    // console.log(material.fragmentShader)

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