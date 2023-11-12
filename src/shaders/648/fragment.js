// float blob(vec2 vUv, float x, float y){
//     vec2 pos = vec2(0.5) - vUv;
//     float r = length(pos) * 2.0;
//     float a = atan(pos.y, pos.x);
//     float f = abs(cos(a * 13.) * sin(a * (x + cos(u_time) + 0.5))) * .02+ .2;
//     return 1. - smoothstep(f, f+0.01, r);
// }

// float blobOutline(vec2 vUv, float x, float y){
//     vec2 pos = vec2(0.5) - vUv;
//     float r = length(pos) * 2.0;
//     float a = atan(pos.y, pos.x);
//     float f = abs(cos(a * 13.) * cos(a * (x + sin(u_time) + 0.5))) * .1+ .3;
//     float m = 1. - smoothstep(f, f+0.01, r);
//     float n = 1. - smoothstep(f+ 0.05, f+0.06, r);
//     return n - m;
// }

// void main()
// {
//     vec2 vUv = vec2(vUv.x, vUv.y);
//     vUv = vUv / 2. + 0.25;
//     vec3 color = vec3(0.);

//     float x = blobOutline(vUv, 8., 0.5);
//     float y = blob(vUv, 8., 0.5);
//     color = vec3(x + y);

//     gl_FragColor = vec4(color, 1.);
// }

import glsl from 'babel-plugin-glsl/macro'

const fragmentShader = glsl`

    #define S(a, b, t) smoothstep(a, b, t)
    uniform sampler2D u_audio;
    float label(vec2 p)
    {
        p *= 10.;
        p.x -= 0.25;
        float left = numSix(vec2(p.x + 0.35, p.y));
        float center = numFour(vec2(p.x -0.03, p.y));
        float right = numEight(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    float blob(vec2 vUv, float x, float y){
        vec2 audioVal;
        audioVal.x = texture2D(u_audio, vec2(vUv.x / 2., 0.)).r;
        audioVal.y = texture2D(u_audio, vec2(vUv.y / 2., 0.)).r;
        vUv *= y;
        vec2 pos = vec2(y/2.) - vUv;
        float r = length(pos) * 2.0;
        float a = atan(pos.y, pos.x);
        float f = abs(cos(a * 13. * audioVal.y) * sin(a * (x))) * .02  + .25 * audioVal.y;
        return 1. - smoothstep(f, f+0.01, r);
    }

    float blobOutline(vec2 vUv, float x, float y){
        vec2 audioVal;
        audioVal.x = texture2D(u_audio, vec2(vUv.x / -2., 0.)).r;
        audioVal.y = texture2D(u_audio, vec2(vUv.y / 2., 0.)).r;
        vUv *= y;
        float noise = (noise2D(vUv + audioVal)) * 15. * audioVal.x;
        // x += noise;
        vec2 pos = vec2(y/2.) - vUv;
        float r = length(pos ) * 2.0;
        float a = atan(pos.y , pos.x );
        float f = abs(cos(a * 13. * audioVal.x ) * sin(a * (x))) * .02  + .25 * audioVal.x;
        float m = 1. - smoothstep(f, f+0.01, r);
        float n = 1. - smoothstep(f+ 0.05, f+0.06, r);
        return n - m;
    }

    void main()
    {

        vec2 vUv = vec2(vUv.x, vUv.y);
        // vec2 vUv = gl_FragCoord.xy/u_resolution.xy;
        vec3 color = vec3(.0, 0., 0.);
        vec3 bckgdcl = vec3(0.825, 0.5, 0.6);
        vec2 uv2 = vUv;
        // uv2 -= .5;

        float f = texture2D(u_audio, vec2(uv2.x * 0.5, 0.)).r;
        // f = clamp(f * 2., 0.1, 1.1)* 2.;
        // float noise = noise2D(uv2 * 0.5 * sin(u_time * f)) ;
        float y = blob(uv2  , 10., 0.5);
        float x = blobOutline(uv2, 10., 0.45);
        color += vec3(y + x);


        float numLabel = label(vUv);
        color += numLabel;
        gl_FragColor = vec4(color, 1.);
    }
`

const vertexShader = glsl`
varying vec2 vUv;

void main()
{
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`

import { Vector2, ShaderMaterial } from 'three'
import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import numbers from '../numLabels/numbers.js'
import preload from '../preload/preload.js'
import usefulFunctions from '../usefulFunctions/usefulFunctions.js'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import useShader from '../../stores/useShader.js'

export default function Shader648()
{
    const r = './Models/EnvMaps/0/';

    const urls = [ r + 'px.jpg', r + 'nx.jpg',
    r + 'py.jpg', r + 'ny.jpg',
    r + 'pz.jpg', r + 'nz.jpg' ];

    const textureCube = new THREE.CubeTextureLoader().load(urls)
    const currentShader = useShader(state => state.currentShader)
    console.log(currentShader)
    const setSongOn = useShader(state => state.setSongOn)
    const startSong = useShader(state => state.startSong)
    const turnOffSong = useShader(state => state.setSongOff)
    

    let camera = null
    let renderer = null

    useThree((state) => {
        camera = state.camera
        renderer = state.gl
    })

    const [music, setMusic] = useState(false)
    const fftSize = 128
    const format = ( renderer.capabilities.isWebGL2 ) ? THREE.RedFormat : THREE.LuminanceFormat
    const listener = new THREE.AudioListener()
    const analyser = useRef()
    const analyserTexture = useRef()
    const sound = useRef()
    sound.current = new THREE.Audio(listener)
    if(camera) {
        camera.add(listener)
    }
    const audioLoader = new THREE.AudioLoader()    
    
    audioLoader.load('./Audio/new-adventure-matrika.ogg', (buffer) => {
        sound.current.setBuffer( buffer );
        sound.current.setLoop( false );
        sound.current.setVolume( 0.5 );
        // sound.current.play()
        // sound.current.stop(100000)
        
        // if(sound.current.isPlaying){
        //     console.log('playing')
        //     setMusic(true)
        //     setSongOn()
        //     startSong() 
        // } else {
        //     console.log('ended')
        //     setMusic(false)
        //     turnOffSong()
        // }
            
        // if(!sound.current.isPlaying){
        //     console.log('ended')
        //     setMusic(false)
        //     turnOffSong()
        // }
    })


    const play = () => {
        sound.current.play()
        analyser.current = new THREE.AudioAnalyser(sound.current, fftSize)
        analyserTexture.current = new THREE.DataTexture(analyser.current.data, 64, 1, format)  
        setMusic(true)
        setSongOn()
        startSong() 
    }

    // const stop = () => {
    //     sound.current.stop()
    //     analyser.current = null
    //     analyserTexture.current = null
    //     setMusic(false)
    //     turnOffSong() 
    // }
    
    const material = new ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: preload + usefulFunctions + numbers + fragmentShader,
        uniforms: {
            u_time: { type: "f", value: 1.0 },
            u_resolution: { type: "v2", value: new Vector2(1, 1) },
            u_mouse: { type: "v2", value: new Vector2() },
            u_cubemap: { value: textureCube},
            u_audio: { value: analyserTexture.current }
        }
    })

    const meshRef = useRef()

    let mouseX;
    let mouseY;
  
    useFrame(({clock}) => {
        if(analyser.current) analyser.current.getFrequencyData()
        meshRef.current.material.uniforms.u_time.value = clock.elapsedTime
        meshRef.current.material.uniforms.u_mouse.value = new Vector2(mouseX, mouseY)
        if(meshRef.current.material.uniforms.u_audio.value) meshRef.current.material.uniforms.u_audio.value.needsUpdate = true
        listener.needsUpdate = true
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

    const playStyle = {
        cursor: 'pointer',
        color: 'white',
        alignItems: 'center',
        display: 'inline-flex',
        justifyContent: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#000000',
        padding: '10px'
    }
    const stopStyle = {
        cursor: 'pointer',
        color: 'white',
        alignItems: 'center',
        display: 'inline-flex',
        justifyContent: 'center',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#000000',
        padding: '10px'
    }

    return (
        <>
            {!music && <Html>
                    <div className='play'><button onClick={play} style={playStyle}>Play</button></div>
            </Html>}
            {/* {music && <Html>
                    <div className='stop'><button onClick={stop} style={stopStyle}>Stop</button></div>
            </Html>} */}
            <mesh dispose={null} ref={meshRef} material={material} >
                
                <boxGeometry args={[2, 2, 0.1]} />
            </mesh>
        </>
    )
}