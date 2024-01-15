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
      

    float label(vec2 p)
    {

        p *= 10.;
        p.x -= 0.25;
        // p = p +  vec2(7., 3.5);
        float left = numSeven(vec2(p.x + 0.35, p.y));
        float center = numZero(vec2(p.x -0.03, p.y));
        float right = numZero(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    //fbm
    float fbm(vec3 p, int octaves, float persistence, float lacunarity) {
        float amplitude = 0.5;
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
      
        return total;
      }

      //fbm
    float ridgedFBM(vec3 p, int octaves, float persistence, float lacunarity) {
        float amplitude = 0.5;
        float frequency = 1.0;
        float total = 0.0;
        float normalization = 0.0;
      
        for (int i = 0; i < octaves; ++i) {
          float noiseValue = noise(p * frequency);
          noiseValue = abs(noiseValue);
          noiseValue = 1.0 - noiseValue;

          total += noiseValue * amplitude;
          normalization += amplitude;
          amplitude *= persistence;
          frequency *= lacunarity;
        }
      
        total /= normalization;
        total *= total;
      
        return total;
      }

      float turbulanceFBM(vec3 p, int octaves, float persistence, float lacunarity) {
        float amplitude = 0.5;
        float frequency = 1.0;
        float total = 0.0;
        float normalization = 0.0;
      
        for (int i = 0; i < octaves; ++i) {
          float noiseValue = noise(p * frequency);
          noiseValue = abs(noiseValue);
        //   noiseValue = 1.0 - noiseValue;

          total += noiseValue * amplitude;
          normalization += amplitude;
          amplitude *= persistence;
          frequency *= lacunarity;
        }
      
        total /= normalization;
        // total *= total;
      
        return total;
      }

      float cellular(vec3 coords)
      {
        vec2 gridBasePosition = floor(coords.xy);
        vec2 gridCoordOffset = fract(coords.xy);

        float closest  = 1.0;
        for (float y = -2.0; y <= 2.0; y += 1.0){
            for (float x = -2.0; x <= 2.0; x += 1.0){
                vec2 neighbourCellPosition = vec2(x, y);
                vec2 cellWorldPosition = gridBasePosition + neighbourCellPosition;
                vec2 cellOffSet = vec2(
                    noise(vec3(cellWorldPosition, coords.z) + vec3(243.432, 324.235, 0.0 )),
                    noise(vec3(cellWorldPosition, coords.z))
                );

                float distToNeighbour = length(
                    neighbourCellPosition + cellOffSet - gridCoordOffset
                );
                closest = min(closest, distToNeighbour);
            }
        }

        return closest;
      }

      float stepped(float noiseSample){
        float steppedSample = floor(noiseSample * 10.) / 10.;
        float remainder = fract(noiseSample * 10.);
        steppedSample = (steppedSample - remainder) * 0.5 + 0.5;
        return steppedSample;
      }

      float domainWarpingFBM(vec3 coords)
      {
        vec3 offset = vec3(
            fbm(coords, 4, 0.5, 2.0),
            fbm(coords + vec3(43.235, 23.112, 0.), 4, 0.5, 2.0), 0.0);
            float noiseSample = fbm(coords + offset, 1, 0.5, 2.);

            vec3 offset2 = vec3(
                fbm(coords + 4.0 * offset + vec3(5.23, 1.42, 3.235), 4, 0.5, 2.0),
                fbm(coords + 4.0 * offset + vec3(4.13, 0.422, 8.2335), 4, 0.5, 2.0), 0.0);
            noiseSample = fbm(coords + 4.0 * offset2, 1, 0.5, 2.);

            return noiseSample;
      }

    void main()
    {
        vec3 coords = vec3(vUv * 2.5, u_time * 0.2);
        vec2 vUv = vec2(vUv.x, vUv.y);
        vec3 color = vec3(0.);
        float noiseSample = 0.;

        // noiseSample = remap(noise(coords), -1., 1., 0., 1.);
        // noiseSample = remap(fbm(coords, 4, 0.5, 2.0), -1., 1., 0., 1.);
        // noiseSample = ridgedFBM(coords, 4, 0.5, 2.0);
        // noiseSample = turbulanceFBM(coords, 4, 0.5, 2.0);
        // noiseSample = cellular(coords);
        // noiseSample = stepped(noiseSample);
        // noiseSample = remap(domainWarpingFBM(coords), -1.0, 1.0, 0., 1.);

        vec3 pixel = vec3(0.5 / u_resolution, 0.);

        // float s1 = stepped(cellular(coords + pixel.xzz));
        // float s2 = stepped(cellular(coords - pixel.xzz));
        // float s3 = stepped(cellular(coords + pixel.zyz));
        // float s4 = stepped(cellular(coords - pixel.zyz));
        // float s1 = ridgedFBM(coords + pixel.xzz, 4, 0.5, 2.0);
        // float s2 = ridgedFBM(coords - pixel.xzz, 4, 0.5, 2.0);
        // float s3 = ridgedFBM(coords + pixel.zyz, 4, 0.5, 2.0);
        // float s4 = ridgedFBM(coords - pixel.zyz, 4, 0.5, 2.0);
        float s1 = turbulanceFBM(coords + pixel.xzz, 2, 0.5, 2.0);
        float s2 = turbulanceFBM(coords - pixel.xzz, 4, 0.5, 2.0);
        float s3 = turbulanceFBM(coords + pixel.zyz, 4, 0.5, 2.0);
        float s4 = turbulanceFBM(coords - pixel.zyz, 2, 0.5, 2.0);
        vec3 normal = normalize(vec3(s1 - s2, s3 - s4, 0.001));

        vec3 skyColor = vec3(0., 0.3, 0.6);
        vec3 groundColor = vec3(0.6, 0.3, 0.1);

        vec3 hemi = mix(groundColor, skyColor, remap(normal.y, -1.0, 1., 0., 1.));

        vec3 lightDir = normalize(vec3(1.));
        vec3 lightColor = vec3(1., 1., 0.9);
        float dp = max(0., dot(lightDir, normal));

        vec3 diffuse = dp * lightColor;
        vec3 specular = vec3(0.);

        vec3 r = normalize(reflect(-lightDir, normal));
        float phongValue = max(0., dot(vec3(0., 0., 1.), r));
        phongValue = pow(phongValue, 32.0);

        specular += phongValue;

        vec3 baseColor = mix(
            vec3(0., 0.27, 0.65),
            vec3(0., 0.5, 0.68), 
            smoothstep(0., 1., noiseSample)
        );

        vec3 lighting = hemi * 0.125 + diffuse * 0.5;
        color = baseColor * lighting + specular;
        color = pow(color, vec3(1. / 2.));

        // color = vec3(noiseSample);
        // color = normal;

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

export default function Shader700()
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