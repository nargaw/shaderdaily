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
        float center = numThree(vec2(p.x -0.03, p.y));
        float right = numFour(vec2(p.x - 0.42, p.y));
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
        vec3 s = texture2D(uMap, vec2(vUv.x, vUv.y + f) ).rgb;

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

        float x = floor(vLayoutUv.x * 10. * 3.88);
        float y = floor(vLayoutUv.y * 10.);
        float pattern = noise(vec2(x, y));

        vec3 blue = vec3(0.634, 0.966, 0.788);
        vec4 l1 = vec4(vec3(0.12, .7987, 0.234), border);
        vec4 l2 = vec4(vec3(.502, 0.278, 0.369), border);
        vec4 l3 = vec4(blue, outset);
        vec4 l4 = vec4(vec3(0.204, .204, .29), outset);

        float width = 1.0;

        float p0 = (1. );
        p0 = map(p0, 0., 1., -width, 1.);
        p0 = smoothstep(p0, p0 + width, vLayoutUv.x);
        float mix0 = 2. * p0 - pattern; 
        mix0 = clamp(mix0, 0., 1.);

        float p2 = (1. );
        p2 = map(p2, 0., 1., -width, 1.);
        p2 = smoothstep(p2, p2 + width, vLayoutUv.x);
        float mix2 = 2. * p2 - pattern; 
        mix2 = clamp(mix2, 0., 1.);

        float p3 = (1.);
        p3 = map(p3, 0., 1., -width, 1.);
        p3 = smoothstep(p3, p3 + width, vLayoutUv.x);
        float mix3 = 2. * p3 - pattern; 
        mix3 = clamp(mix3, 0., 1.);

        float p4 = (cos(u_time * 0.99) );
        p4 = map(p4, 0., 1., -width, 1.);
        p4 = smoothstep(p4, p4 + width, vLayoutUv.x);
        float mix4 = 2. * p4 - pattern; 
        mix4 = clamp(mix4, 0., 1.);

        vec4 layer1 = mix(vec4(0.), l1, 1. - mix0);
        vec4 layer2 = mix(layer1, l2, 1. - mix2);
        vec4 layer3 = mix(layer2, l3, 1. - mix3);
        vec4 layer4 = mix(layer3, l4, 1. - mix4);

        float circle = distance(vLayoutUv - offset, vec2(0.5));
        circle = smoothstep(0.2, 0.21, circle);

        color = 1. - mix(vec3(1.), vec3(0.), circle);

        vec4 finalLayer = vec4(color, uOpacity * alpha);

        gl_FragColor = finalLayer;
        // gl_FragColor = vec4(uStrokeColor, 1.);
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

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
}



float displace(vec3 point) {
    return cnoise(point * 2.0 + vec3(u_time * 0.25)) * 1.0;
  }

vec3 orthogonal(vec3 v){
    return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0) : vec3(0.0, -v.z, v.y));
}

void main() {
    vec3 displacedPosition = position + normal * displace(position);
    // Output
    vec3 localSpacePosition = position;
    float noise = cnoise(localSpacePosition);
    float wave = sin(localSpacePosition.y * 0.5 + u_time);

    localSpacePosition.z += wave * noise;
    vec4 mvPosition = modelMatrix * vec4(displacedPosition, 1.0);
    mvPosition = viewMatrix * mvPosition;
    // gl_Position = projectionMatrix * mvPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(localSpacePosition, 1.);

    // Varyings
    vUv = uv;
    vLayoutUv = layoutUv;
    vViewPosition = -localSpacePosition.xyz;
    vNormal = normal;

    vLineIndex = lineIndex;

    vLineLettersTotal = lineLettersTotal;
    vLineLetterIndex = lineLetterIndex;

    vLineWordsTotal = lineWordsTotal;
    vLineWordIndex = lineWordIndex;

    vWordIndex = wordIndex;

    vLetterIndex = letterIndex;

    float offset = 4.0/256.0;
    vec3 tangent = orthogonal(normal);
    vec3 bitangent = normalize(cross(normal, tangent));
    vec3 neighbour1 = position + tangent * offset;
    vec3 neighbour2 = position + bitangent * offset;
    vec3 displacedNeighbour1 = neighbour1 + normal * displace(neighbour1);
    vec3 displacedNeighbour2 = neighbour2 + normal * displace(neighbour2);

    vec3 displacedTangent = displacedNeighbour1 - displacedPosition;
    vec3 displacedBitangent = displacedNeighbour2 - displacedPosition;

    vec3 displacedNormal = normalize(cross(displacedTangent, displacedBitangent));

    // vPosition = (modelMatrix * vec4(displacedPosition, 1.)).xyz;
    // vNormal = displacedNormal * normalMatrix;
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
import { Text } from '@react-three/drei'
import { MSDFTextGeometry, MSDFTextMaterial, uniforms } from 'three-msdf-text-utils/src/index.js'
import { FontLoader } from 'three/examples/jsm/Addons.js'
// import fnt from './Font/TitanOne-msdf.json'
// import png from './Font/TitanOne.png'

export default function Shader734()
{
    
    const meshRef = useRef()
    const loader = new THREE.TextureLoader()
    const fontLoader = new FontLoader()
    const fnt = './Font/TitanOne-msdf.json'
    const png = './Font/TitanOne.png'
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


    const fontImage = loader.load(png)
    const fontJson = fontLoader.load(fnt, (font) => {
        const f = font
        const fontGeometry = new MSDFTextGeometry({
            text: "CONTRAST",
            font: f.data
        })
        // console.log(fontImage)
        material.uniforms.uMap.value = fontImage
        if(meshRef.current){
            meshRef.current.geometry = fontGeometry
            meshRef.current.scale.set(0.015, -0.015, 0.015)
            meshRef.current.position.x = -1.5
        }
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


    
    

    // Promise.all([
    //     loadFontAtlas(png),
    // ]).then(([atlas]) => {
    //     const geometry = new MSDFTextGeometry({
    //         text: "GLSL",
    //         font: fnt,
    //     });
    //     console.log(geometry.computeBoundingBox())
    //     material.uniforms.uMap.value = atlas;
    
    //     // const mesh = new THREE.Mesh(geometry, msdfMaterial);
    //     // scene.add(mesh)
    //     // mesh.scale.set(0.1, -0.1, 0.1)
    //     // mesh.position.x = -6.5
    // });

    const meshSize = 2

    const geometry = new THREE.PlaneGeometry(meshSize, meshSize, 256, 256)

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

    // console.log(meshRef.current.geometry)
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