import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    // https://www.shadertoy.com/view/4dSfDK
    #define S(a, b, t) smoothstep(a, b, t)
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
        float center = numTwo(vec2(p.x -0.03, p.y));
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
    
    float opOnion( in vec2 p, in float r, float sdf )
    {
    return abs(sdf) - r;
    }

    float sdPoly1(vec2 p, int sides)
    {
        // p = p * 2. - 1.;
        float angle = atan(p.x, p.y) + PI;
        float radius = TWO_PI/float(sides);
        float d = cos(floor(.5 + angle/ radius) * radius - angle) * length(p);
        return d;
    }

    float bezier(vec2 p, vec2 v0, vec2 v1, vec2 v2) { // fold
        vec2 i = v0 - v2;
        vec2 j = v2 - v1;
        vec2 k = v1 - v0;
        vec2 w = j-k;

        v0-= p; v1-= p; v2-= p;
        
        float x = v0.x*v2.y-v0.y*v2.x;
        float y = v1.x*v0.y-v1.y*v0.x;
        float z = v2.x*v1.y-v2.y*v1.x;

        vec2 s = 2.0*(y*j+z*k)-x*i;

        float r =  (y*z-x*x*0.25)/dot(s,s);
        float t = clamp( (0.5*x+y+r*dot(s,w))/(x+y+z),0.0,1.0);
        
        vec2 d = v0+t*(k+k+t*w);
        vec2 outQ = d + p;
        return length(d);
    }

    float sdOval(vec2 p, vec2 r) {
        return (length(p / r) - 1.0) * min(r.x, r.y);
      }

    void main()
    {
        vec2 coords = vUv;
        vec3 color;
        vec2 numCoords = coords;
        vec2 m = u_mouse;

        vec4 textureColor = texture2D(u_texture, coords);
        
        //face
        vec2 c1Coords = coords;
        c1Coords -= 0.5;
        c1Coords.x -= 0.03;
        c1Coords.y -= 0.06;
        float d = sdfCircle(c1Coords, 0.18);

        

        vec2 c2Coords = coords;
        c2Coords = Rot(c2Coords, PI * 0.08);
        c2Coords -= 0.5;
        c2Coords.y += 0.013;
        c2Coords.x -= 0.03;
        c2Coords.x *= 0.58;
        c2Coords.y *= 0.9;
        float mouth = sdfCircle(c2Coords, 0.1);

        vec2 noseCoords = coords;
        noseCoords = Rot(noseCoords, PI * 0.085);
        noseCoords -= 0.5;
        noseCoords.x -= 0.035;
        noseCoords.y -= 0.01;

        vec2 mouthCoords = coords;
        mouthCoords -= 0.5;



        // if(mouth < -0.01) color = vec3(0., 0., 1.);
        d = opUnion(d, mouth);

        d = opUnion(d, sdfCircle(vec2(coords.x - 0.55, coords.y-0.41), 0.05));

        float d2 = sdOval(noseCoords, vec2(0.053, 0.035));

        float d3 = bezier(mouthCoords,  
                 vec2(-.085, -.042), 
                 vec2(0.07, -.15), 
                 vec2(.15, .019)) - 0.0426;
        //if (d3 < 0.0) color = vec3(.71, .839, .922)*step(d3, -.013);
        if(d < 0.01) color = vec3(1.);
        if(d < 0.) color = vec3(1., 0., 0.);
        if(d2 < 0.) color = vec3(0., 1., 0.);
        if(d3 < 0.02) color = vec3(0., 0., 1.);

        color = mix(color, textureColor.xyz, textureColor.a * 0.5);
        float numLabel = label(numCoords);

        color = mix(color, vec3(1.), numLabel) ;
        
        gl_FragColor = vec4(color, 1.0);
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

export default function Shader921() {
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
    const mickey = loader.load('./Models/Textures/photos/mickey.jpg')
    mickey.wrapS = THREE.MirroredRepeatWrapping
    mickey.wrapT = THREE.MirroredRepeatWrapping

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

            u_texture: { value: mickey },
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