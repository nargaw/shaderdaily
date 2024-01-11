import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    #define time u_time

    uniform sampler2D u_texture;
    uniform samplerCube u_background;

    // The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// https://www.youtube.com/c/InigoQuilez
// https://iquilezles.org/
//
// https://www.shadertoy.com/view/lsf3WH
// SimonDev: Renamed function to "Math_Random" from "hash"
float Math_Random(vec2 p)  // replace this by something better
{
  p  = 50.0*fract( p*0.3183099 + vec2(0.71,0.113));
  return -1.0+2.0*fract( p.x*p.y*(p.x+p.y * sin(u_time * 0.00001)) ) ;
}

vec4 noise(vec2 coords) {
  vec2 texSize = vec2(1.0);
  vec2 pc = coords * texSize;
  vec2 base = floor(pc);

  float s1 = Math_Random((base + vec2(0.0, 0.0)) / texSize);
  float s2 = Math_Random((base + vec2(1.0, 0.0)) / texSize);
  float s3 = Math_Random((base + vec2(0.0, 1.0)) / texSize);
  float s4 = Math_Random((base + vec2(1.0, 1.0)) / texSize);

  vec2 f = smoothstep(0.0, .1, fract(pc));

  float px1 = mix(s1, s2, f.x);
  float px2 = mix(s3, s4, f.x);
  float result = mix(px1, px2, f.y);
  return vec4(result);
}

    float label(vec2 p)
    {

        p *= 10.;
        p.x -= 0.25;
        // p = p +  vec2(7., 3.5);
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numNine(vec2(p.x -0.03, p.y));
        float right = numEight(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    //bilinear filtering
    
    
    vec4 filteredSample(sampler2D target, vec2 coords)
    {
        vec2 texSize = vec2(2.);
        vec2 pc = coords * texSize - 0.5;
        vec2 base = floor(pc) + 0.5;

        vec4 s1 = texture2D(target, (base + vec2(0., 0.)) / texSize);
        vec4 s2 = texture2D(target, (base + vec2(1., 0.)) / texSize);
        vec4 s3 = texture2D(target, (base + vec2(0., 1.)) / texSize);
        vec4 s4 = texture2D(target, (base + vec2(1., 1.)) / texSize);

        // vec2 f = fract(pc);
        vec2 f = smoothstep(0., 1., fract(pc));

        vec4 px1 = mix(s1, s2, f.x);
        vec4 px2 = mix(s3, s4, f.x);
        vec4 result = mix(px1, px2, f.y);

        return result;
    }

    void main()
    {
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec2 uv2 = vUv;
        vec2 pixelCoords = (vUv) * u_resolution;
        vec3 color = vec3(0.);

        //color = filteredSample(u_texture, vUv).rgb;
        color = noise(vUv * 20.).rgb;    

        float numLabel = label(vUv);
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
    // gl_Position = vec4(localSpacePosition, 1.);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(localSpacePosition, 1.);
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

export default function Shader698()
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