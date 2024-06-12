import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    //varying
    varying vec2 vLayoutUv;

    // Uniforms: Common
    uniform float uOpacity;
    uniform float uThreshold;
    uniform float uAlphaTest;
    uniform vec3 uColor;
    uniform sampler2D uMap;
    uniform float uProgress;
    uniform float uProgress2;
    uniform float uProgress3;
    uniform float uProgress4;

    // Uniforms: Strokes
    uniform vec3 uStrokeColor;
    uniform float uStrokeOutsetWidth;
    uniform float uStrokeInsetWidth;

    float label(vec2 p)
    {

        p *= 10.;
        // p *= 0.01;
        p.x -= 0.25;
        // p = p +  vec2(7., 3.5);
        float left = numSeven(vec2(p.x + 0.35, p.y));
        float center = numFive(vec2(p.x -0.03, p.y));
        float right = numSeven(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    // Utils: Median
    float median(float r, float g, float b) {
        return max(min(r, g), min(max(r, g), b));
    }

    float random2(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }

    float noise(vec2 p){
        vec2 ip = floor(p);
        vec2 u = fract(p);
        u = u*u*(3.0-2.0*u);
        
        float res = mix(
            mix(random2(ip),rand(ip+vec2(1.0,0.0)),u.x),
            mix(random2(ip+vec2(0.0,1.0)),random2(ip+vec2(1.0,1.0)),u.x),u.y);
        return res*res;
    }


    float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }

    void main()
    {
        float f = noise(vLayoutUv * (sin(u_time) + 10.) + u_time) * 0.01;
        vec2 coords = vec2(vLayoutUv.x, vLayoutUv.y) + f;
        // coords.x *= 3.88;
        // coords.y *= 10.;
        // coords.y *= 0.5;
        
        vec2 m = u_mouse.xy;

        coords += f;

        vec2 offset = vec2(m) - 0.5;
        offset.y *= -1.;
        // offset.x -= 0.35;
        // offset.y -= 0.135;
        vec3 color = vec3(0.);

        // vec2 newCoords = coords ;
        // vec2 m = u_mouse.xy;

        // vec2 offset = vec2(m) - 0.5  ;
         
        // float numLabel = label(vUv);
        // color = mix(color, vec3(1.), numLabel) ;
        // gl_FragColor = vec4(color, 1.);
        // Common
        // Texture sample
        vec3 s = texture2D(uMap, vec2(vUv) ).rgb;

        // Signed distance
        float sigDist = median(s.r, s.g, s.b) - 0.5;

        float afwidth = 1.4142135623730951 / 2.0;

        #ifdef IS_SMALL
            float alpha = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDist);
        #else
            float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
        #endif

        // Strokes
        // Outset
        float sigDistOutset = sigDist + uStrokeOutsetWidth * 0.5;

        // Inset
        float sigDistInset = sigDist - uStrokeInsetWidth * 0.5;

        #ifdef IS_SMALL
            float outset = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistOutset);
            float inset = 1.0 - smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistInset);
        #else
            float outset = clamp(sigDistOutset / fwidth(sigDistOutset) + 0.5, 0.0, 1.0);
            float inset = 1.0 - clamp(sigDistInset / fwidth(sigDistInset) + 0.5, 0.0, 1.0);
        #endif

        // Border
        float border = outset * inset;

        // Alpha Test
        if (alpha < uAlphaTest) discard;

        // Output: Common
        vec4 filledFragColor = vec4( uColor, uProgress * uOpacity * alpha);

        // Output: Strokes
        vec4 strokedFragColor = vec4(uStrokeColor, uOpacity * border);

        float x = floor(vLayoutUv.x * 100. * 3.88);
        float y = floor(vLayoutUv.y * 100.);
        float pattern = noise(vec2(x, y));

        vec3 blue = vec3(0.034, 0.966, 0.988);
        vec4 l1 = vec4(vec3(0.012, .0987, 0.934), inset * outset);
        vec4 l2 = vec4(vec3(.002, 0.278, 0.869), inset * outset);
        vec4 l3 = vec4(vec3(0.924, 0.43, 0.01), uOpacity * alpha);
        vec4 l4 = vec4(vec3(0.7204, .604, .929), outset);

        float width = 1.0;

        float p0 = abs(sin(u_time * 0.5) + 0.25 / 2.);
        p0 = map(p0, 0., 1., -width, 1.);
        p0 = smoothstep(p0, p0 + width, vLayoutUv.x);
        float mix0 = 2. * p0 - pattern; 
        mix0 = clamp(mix0, 0., 1.);

        float p2 = (cos(u_time * 0.5)) + 0.5;
        p2 = map(p2, 0., 1., -width, 1.);
        p2 = smoothstep(p2, p2 + width, vLayoutUv.x);
        float mix2 = 2. * p2 - pattern; 
        mix2 = clamp(mix2, 0., 1.);

        float p3 = (sin(u_time * 0.5)) + 0.75;
        p3 = map(p3, 0., 1., -width, 1.);
        p3 = smoothstep(p3, p3 + width, vLayoutUv.x);
        float mix3 = 2. * p3 - pattern; 
        mix3 = clamp(mix3, 0., 1.);

        float p4 = cos(u_time) + 1.;
        p4 = map(p4, 0., 1., -width, 1.);
        p4 = smoothstep(p4, p4 + width, vLayoutUv.x);
        float mix4 = 2. * p4 - pattern; 
        mix4 = clamp(mix4, 0., 1.);

        vec4 layer1 = mix(vec4(0.), l1, 1. - mix0);
        vec4 layer2 = mix(layer1, l2, 1. - mix2);
        vec4 layer3 = mix(layer2, l3, 1. - mix3);
        vec4 layer4 = mix(layer3, l4, 1. - mix4);

        float circle = distance(vLayoutUv - offset, vec2(0.25, 0.25));
        circle = smoothstep(0.2, 0.21, circle);

        vec4 finalLayer = layer1 + layer3;
        gl_FragColor = finalLayer;
        // gl_FragColor = vec4(vLayoutUv, 0., outset * inset);
        // gl_FragColor = vec4(color, outset);
    }
`

const vertexShader = glsl`
// Attribute
attribute vec2 layoutUv;

attribute float lineIndex;

attribute float lineLettersTotal;
attribute float lineLetterIndex;

attribute float lineWordsTotal;
attribute float lineWordIndex;

attribute float wordIndex;

attribute float letterIndex;

// Varyings
varying vec2 vUv;
varying vec2 vLayoutUv;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec3 vPosition;

varying float vLineIndex;

varying float vLineLettersTotal;
varying float vLineLetterIndex;

varying float vLineWordsTotal;
varying float vLineWordIndex;

varying float vWordIndex;

varying float vLetterIndex;

uniform vec2 u_mouse;
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

void main() {
    
    vec3 localSpacePosition = position;

    float wave = sin(localSpacePosition.x * 4.5 + u_time * 4.);

    localSpacePosition.y += wave;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(localSpacePosition, 1.);
    // vNormal = (modelMatrix * vec4(normal, 0.)).xyz;

    // Varyings
    vUv = uv;
    vLayoutUv = layoutUv;
    // vViewPosition = -localSpacePosition.xyz;
    vNormal = normal;

    vLineIndex = lineIndex;

    vLineLettersTotal = lineLettersTotal;
    vLineLetterIndex = lineLetterIndex;

    vLineWordsTotal = lineWordsTotal;
    vLineWordIndex = lineWordIndex;

    vWordIndex = wordIndex;

    vLetterIndex = letterIndex;
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
import { Center, Text } from '@react-three/drei'
import { MSDFTextGeometry, MSDFTextMaterial, uniforms } from 'three-msdf-text-utils/src/index.js'
import { FontLoader } from 'three/examples/jsm/Addons.js'
// import fnt from './Font/TitanOne-msdf.json'
// import png from './Font/TitanOne.png'

export default function Shader757()
{
    
    const meshRef = useRef()
    const loader = new THREE.TextureLoader()
    const fontLoader = new FontLoader()
    // const fnt = './Font/TitanOne-msdf.json'
    // const png = './Font/TitanOne.png'
    const fnt = './Font/MrsSheppards-msdf.json'
    const png = './Font/MrsSheppards.png'
    console.log(fnt)

    const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        transparent: true,
        defines: {
            IS_SMALL: false,
        },
        extensions: {
            derivatives: true,
        },
        vertexShader: vertexShader ,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            // Common
            ...uniforms.common,
            
            // Rendering
            ...uniforms.rendering,
            
            // Strokes
            ...uniforms.strokes,
            ...{
                uStrokeColor: {value: new THREE.Color(0x0000ff)}
            },
            u_cameraPosition: {value: new THREE.Vector3()},
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { type: "v2", value: new Vector2() },
            // uMap: {value: new THREE.Vector2()},
        },
    })

    const textSize = 0

    const fontImage = loader.load(png)
    const fontJson = fontLoader.load(fnt, (font) => {
        const f = font
        const fontGeometry = new MSDFTextGeometry({
            text: "hello world",
            font: f.data
        })
        
        material.uniforms.uMap.value = fontImage
        if(meshRef.current){
            meshRef.current.geometry = fontGeometry
            meshRef.current.scale.set(0.025, -0.025, 0.025)
            meshRef.current.position.x = -2.0
        }
        // console.log(fontGeometry.computeBoundingBox())
    })


    const r = './Models/EnvMaps/0/';
    const urls = [ 
        r + 'px.jpg', 
        r + 'nx.jpg',
        r + 'py.jpg', 
        r + 'ny.jpg',
        r + 'pz.jpg', 
        r + 'nz.jpg' ];

    const textureCube = new THREE.CubeTextureLoader().load(urls)
    
    
    const monalisa = loader.load('./Models/Textures/photos/monalisa.jpg')
    // threeLogo.wrapS = THREE.MirroredRepeatWrapping
    // threeLogo.wrapT = THREE.MirroredRepeatWrapping

    const DPR = Math.min(window.devicePixelRatio, 1.);

    const meshSize = 2

    // const geometry = new THREE.PlaneGeometry(meshSize, meshSize, 256, 256)
    // console.log(geometry)
    let mouseX;
    let mouseY;

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
    })

    const remap = (value, low1, high1, low2, high2 ) => {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
    }

    addEventListener('mousemove', (e) => {
        if(e.clientX >= meshSizes.leftPixel && e.clientX <= meshSizes.rightPixel){
            mouseX = remap(e.clientX, meshSizes.leftPixel, meshSizes.rightPixel, 0, 1)
        }
        if(e.clientY >= meshSizes.topPixel && e.clientY <= meshSizes.bottomPixel){
            mouseY = remap(e.clientY, meshSizes.topPixel, meshSizes.bottomPixel, 1, 0)
        }
    })

    addEventListener('contextmenu', e => e.preventDefault())

    addEventListener('touchmove', (e) => {
        if(e.clientX >= meshSizes.leftPixel && e.clientX <= meshSizes.rightPixel){
            mouseX = remap(e.clientX, meshSizes.leftPixel, meshSizes.rightPixel, 0, 1)
        }
        if(e.clientY >= meshSizes.topPixel && e.clientY <= meshSizes.bottomPixel){
            mouseY = remap(e.clientY, meshSizes.topPixel, meshSizes.bottomPixel, 1, 0)
        }
    }, {passive: false})

    return (
        <>
            <Center>
                <mesh 
                    ref={meshRef} 
                    // geometry={geometry}
                    material={material}    
                />
            </Center>
            
        </>
    )
}