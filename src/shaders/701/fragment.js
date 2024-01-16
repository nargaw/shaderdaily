import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    #define time u_time

    uniform sampler2D u_texture;
    uniform samplerCube u_background;

    float inverseLerp(float v, float minValue, float maxValue) {
    return (v - minValue) / (maxValue - minValue);
    }
    
    float remap(float v, float inMin, float inMax, float outMin, float outMax) {
    float t = inverseLerp(v, inMin, inMax);
    return mix(outMin, outMax, t);
    }
      

    float label(vec2 p)
    {

        // p *= 10.;
        p *= 0.01;
        p.x -= 0.25;
        p = p +  vec2(7., 3.5);
        float left = numSeven(vec2(p.x + 0.35, p.y));
        float center = numZero(vec2(p.x -0.03, p.y));
        float right = numOne(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    // The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// https://www.youtube.com/c/InigoQuilez
// https://iquilezles.org/
//
// https://www.shadertoy.com/view/Xsl3Dl
vec3 hash( vec3 p ) // replace this by something better
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
            dot(p,vec3(269.5,183.3,246.1)),
            dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec3 p )
{
  vec3 i = floor( p );
  vec3 f = fract( p );
	
	vec3 u = f*f*(3.0-2.0*f);

  return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                        dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                        dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
              mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                        dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                   mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                        dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}

float fbm(vec3 p, int octaves, float persistence, float lacunarity) {
    float amplitude = 1.0;
    float frequency = 1.0;
    float total = 0.0;
    float normalization = 0.0;
  
    for (int i = 0; i < octaves; ++i) {
      float noiseValue = noise(p * frequency);
      total += noiseValue * amplitude;
      normalization += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }
  
    total /= normalization;
    total = smoothstep(-1.0, 1.0, total);
  
    return total;
  }

  vec3 GenerateSky(){
    vec3 color1 = vec3(0.4, 0.6, 0.9);
    vec3 color2 = vec3(0.1, 0.15, 0.4);
    return mix(color1, color2, smoothstep(0., 1., vUv.y));
  }
  
  vec3 DrawMountains(vec3 background, vec3 mountainColor, vec2 pixelCoords, float depth){

    // float y = sin(pixelCoords.x/256.) * 256.0;
    float y = fbm(vec3(depth + pixelCoords.x/256.0, 1.432, 3.643), 6, 0.5, 2.0) * 256.0;


    vec3 fogColor = vec3(0.4, 0.6, 0.9);
    float fogFactor = smoothstep(0., 8000., depth) * 0.5;

    float heightFactor = smoothstep(256., -512.0, pixelCoords.y);
    heightFactor *= heightFactor;
    fogFactor = mix(heightFactor, fogFactor, fogFactor);

    mountainColor = mix(mountainColor, fogColor, fogFactor );

    float sdfMountain = pixelCoords.y - y;
    float blur = 1.0 + smoothstep(200., 6000., depth) * 128. + smoothstep(200., -1400., depth) * 128.;
    vec3 color = mix(mountainColor, background, smoothstep(0., blur, sdfMountain));
    return color;
  }


    void main()
    {
        vec2 pixelCoords = (vUv - 0.5) * u_resolution;
        vec3 color = GenerateSky();
        
        vec2 timeOffset = vec2(time * 50., 0.);
        vec2 mountainCoords = (pixelCoords - vec2(0., 400.)) * 8. + timeOffset ;
        color = DrawMountains(color, vec3(0.08, 0.41, 0.74), mountainCoords, 6000.);

        mountainCoords = (pixelCoords - vec2(0., 360.)) * 4. + timeOffset;
        color = DrawMountains(color, vec3(0.14, 0.40, 0.64), mountainCoords, 3200.);

        mountainCoords = (pixelCoords - vec2(0., 280.)) * 2. + timeOffset;
        color = DrawMountains(color, vec3(0.21, 0.39, 0.55), mountainCoords, 1600.);

        mountainCoords = (pixelCoords - vec2(0., 150.)) * 1. + timeOffset;
        color = DrawMountains(color, vec3(0.29, 0.38, 0.45), mountainCoords, 800.);

        mountainCoords = (pixelCoords - vec2(0., -100.)) * 0.5 + timeOffset;
        color = DrawMountains(color, vec3(0.38, 0.37, 0.36), mountainCoords, 400.);

        mountainCoords = (pixelCoords - vec2(0., -500.)) * 0.25 + timeOffset;
        color = DrawMountains(color, vec3(0.46, 0.36, 0.26), mountainCoords, 200.);

        mountainCoords = (pixelCoords - vec2(0., -1400.)) * 0.125 + timeOffset;
        color = DrawMountains(color, vec3(0.55, 0.35, 0.17), mountainCoords, 0.);
    

        float numLabel = label(pixelCoords);
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

export default function Shader701()
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
    const colorsTexture = loader.load('./Models/Textures/Colors/texture.png')
    colorsTexture.minFilter = THREE.NearestFilter
    colorsTexture.magFilter = THREE.NearestFilter
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
            u_texture: {value: colorsTexture},
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