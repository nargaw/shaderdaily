import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`
    // https://www.shadertoy.com/view/4dSfDK
    #define S(a, b, t) smoothstep(a, b, t)
    #define time u_time

    uniform sampler2D u_texture;
    

    float label(vec2 p)
    {
        p *= 10.;
        // p *= 0.01;
        p.x -= 0.25;
        // p = p +  vec2(7., 3.5);
        float left = numEight(vec2(p.x + 0.35, p.y));
        float center = numThree(vec2(p.x -0.03, p.y));
        float right = numZero(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }
    
    mat2 Rot(float a){
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }

    float line( in vec2 p, in vec2 a, in vec2 b, float thickness )
    {
        vec2 ba = b-a;
        vec2 pa = p-a;
        float h =clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
        return 1. - smoothstep(0.0, 0.01, length(pa-h*ba) - thickness);
    }

    float circleSDF(vec2 _st, float _radius){
        vec2 pos = vec2(0.5)-_st;
        return smoothstep(1.0-_radius,1.0-_radius+_radius*0.2,1.-dot(pos,pos)*3.14);
    }

    vec2 movingTiles(vec2 _st, float _zoom, float _speed){
        _st *= _zoom;
        float time = u_time * 0.5;

        if( fract(time)>0.0 ){
            if (fract( _st.y * 0.5) > 0.5){
                _st.x += fract(time)*1.0;
            } else {
                _st.x -= fract(time)*1.0;
            }
        } else if (fract(time) > 0.25 && fract(time) <= 0.5) {
            if (fract( _st.x * 0.5) > 0.5){
                _st.y += fract(time)*1.0;
            } else {
                _st.y -= fract(time)*1.0;
            }
        } else if (fract(time) > 0.5 && fract(time) <= 0.75){
            if (fract( _st.y * 0.5) > 0.5){
                _st.x -= fract(time)*1.0;
            } else {
                _st.x += fract(time)*1.0;
            }
        } else if (fract(time) > 0.75 && fract(time) <= 1.0){
            if (fract( _st.x * 0.5) > 0.5){
                _st.y -= fract(time)*2.0;
            } else {
                _st.y += fract(time)*2.0;
            }
        }


        return fract(_st);
    }

    float pristineGrid( in vec2 uv, vec2 lineWidth)
    {
        vec2 ddx = dFdx(uv);
        vec2 ddy = dFdy(uv);
        vec2 uvDeriv = vec2(length(vec2(ddx.x, ddy.x)), length(vec2(ddx.y, ddy.y)));
        bvec2 invertLine = bvec2(lineWidth.x > 0.5, lineWidth.y > 0.5);
        vec2 targetWidth = vec2(
          invertLine.x ? 1.0 - lineWidth.x : lineWidth.x,
          invertLine.y ? 1.0 - lineWidth.y : lineWidth.y
          );
        vec2 drawWidth = clamp(targetWidth, uvDeriv, vec2(0.5));
        vec2 lineAA = uvDeriv * 1.5;
        vec2 gridUV = abs(fract(uv) * 2.0 - 1.0);

       
         
        gridUV.x = invertLine.x ? gridUV.x : 1.0 - gridUV.x;
        gridUV.y = invertLine.y ? gridUV.y : 1.0 - gridUV.y;
        vec2 grid2 = smoothstep(drawWidth + lineAA, drawWidth - lineAA, gridUV);
    
        grid2 *= clamp(targetWidth / drawWidth, 0.0, 1.0);
        grid2 = mix(grid2, targetWidth, clamp(uvDeriv * 2.0 - 1.0, 0.0, 1.0));
        grid2.x = invertLine.x ? 1.0 - grid2.x : grid2.x;
        grid2.y = invertLine.y ? 1.0 - grid2.y : grid2.y;
        return mix(grid2.x, 1.0, grid2.y);
    }

    void main()
    {
        vec2 coords = vUv;
        vec2 numCoords = coords;
        vec2 coords1 = coords;
        
        coords1 = movingTiles(coords1, 6., 1.0);
        
        coords -= 0.5;
        vec3 color;
        float cir = sdCircleOutline(coords1, 0.5);

        color += cir;
        
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

    // localSpacePosition.xy = localSpacePosition.xy + (ridgedMF(localSpacePosition.xy ) * 0.0125);
    // gl_Position = vec4(position, 1.0);
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


export default function Shader830()
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
    const cityandcolour = loader.load('./Models/Textures/photos/cityandcolour.png')
    // night.wrapS = THREE.MirroredRepeatWrapping
    // night.wrapT = THREE.MirroredRepeatWrapping

    const DPR = Math.min(window.devicePixelRatio, 1.);

    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader ,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_cameraPosition: {value: new THREE.Vector3()},
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(window.innerWidth, window.innerHeight) },
            u_mouse: { value: new THREE.Uniform(new THREE.Vector2()) },
            u_texture: {value: cityandcolour},
        },
    })

    const meshSize = 2

    const geometry = new THREE.PlaneGeometry(meshSize, meshSize, 256, 256)
    const meshRef = useRef()

     //mouse value 1
     let mouseX = 0;
     let mouseY = 0;

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

        mouseX = lerp(mouseX, tempValX, 0.06)
        mouseY = lerp(mouseY, tempValY, 0.06)
    })

    const remap = (value, low1, high1, low2, high2 ) => {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
    }

    addEventListener('mousemove', (e) => {
        if(e.clientX >= meshSizes.leftPixel && e.clientX <= meshSizes.rightPixel){
            tempValX = remap(e.clientX, meshSizes.leftPixel, meshSizes.rightPixel, 0, 1)
        }
        if(e.clientY >= meshSizes.topPixel && e.clientY <= meshSizes.bottomPixel){
            tempValY = remap(e.clientY, meshSizes.topPixel, meshSizes.bottomPixel, 1, 0)
        }
    })

    addEventListener('contextmenu', e => e.preventDefault())

    addEventListener('touchmove', (e) => {
        if(e.clientX >= meshSizes.leftPixel && e.clientX <= meshSizes.rightPixel){
            tempValX = remap(e.clientX, meshSizes.leftPixel, meshSizes.rightPixel, 0, 1)
        }
        if(e.clientY >= meshSizes.topPixel && e.clientY <= meshSizes.bottomPixel){
            tempValY = remap(e.clientY, meshSizes.topPixel, meshSizes.bottomPixel, 1, 0)
        }
    }, {passive: false})

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