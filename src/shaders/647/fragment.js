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
        float right = numSeven(vec2(p.x - 0.42, p.y));
        return left + center + right ;
    }

    float glow(vec2 uv2, vec2 m){
        m = vec2(u_mouse.xy);
        float f = texture2D(u_audio, m * 0.5).r;
        float n = (noise2D(vUv + u_time) * .5 + f ) * 0.5;
        float n2 = noise2D(vec2(uv2.x * f, uv2.y - f) ) * 0.125;
        float d = length((vUv + n2) - abs(u_mouse.xy) ) - 0.25 ;
        //color = (step(0., -d)) * col * n;
        //color += cir * col;

        
        float glow = 0.002/ -d * n ;
        float glow2 = 0.002/ d * n ;
        glow = clamp(glow, 0., 1.);
        glow2 = clamp(glow2, 0., 1.);
        glow = glow * 15. * (sin(u_time * 1.)/10. + 0.75);
        glow2 = glow2 * 15. * (sin(u_time * 1.)/10. + 0.75);

        return glow + glow2;
    }


    void main()
    {

        vec2 vUv = vec2(vUv.x, vUv.y);
        // vec2 vUv = gl_FragCoord.xy/u_resolution.xy;
        vec3 color = vec3(.0, 0., 0.);
        vec3 bckgdcl = vec3(0.825, 0.5, 0.6);
        vec2 uv2 = vUv;
        // uv2 -= .5;

        uv2 = Rot(uv2, u_time * 0.25);

        float f = texture2D(u_audio, vec2(vUv.x* .75, 0.)).r;
        // f = clamp(f, 0.1, 0.9);

        float x = 0.;
        float t = u_time * 0.05;
        
        for(float i =0.; i <1.; i+= 1./4.)
        {
            float z = fract(i + t);//reuse layers
            float size = mix(10., .5, z);
            float fade = S(0., 0.5, z) * S(1., 0.8, z);
            x += glow(uv2 * size + i * 20., vec2(u_mouse.xy)) * fade;
        }
        
        vec3 base = sin(t * vec3(.345, .456, .678)) * .4 + .6;
        vec3 col = x * base;
        col += uv2.y * base * 0.2 ;
        col -= uv2.x  * base * 0.2;
        color += col;

        
        float i = step( uv2.y, f ) * step( f - 0.0125, uv2.y );
        
        // vec3 col = mix(color, bckgdcl, i);

        // color += col.g * i;

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

export default function Shader647()
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
    const playMusic = () => {
        audioLoader.load('./Audio/new-adventure-matrika.ogg', (buffer) => {
            sound.current.setBuffer( buffer );
            sound.current.setLoop( true );
            sound.current.setVolume( 0.5 );
            console.log(sound.current)
            sound.current.play()
            analyser.current = new THREE.AudioAnalyser(sound.current, fftSize)
            analyserTexture.current = new THREE.DataTexture(analyser.current.data, 64, 1, format)  
            if(sound.current.isPlaying){
                console.log('playing')
                setMusic(true)
                setSongOn()
                startSong() 
            }
            
            if(!sound.current.isPlaying){
                console.log('ended')
                setMusic(false)
                turnOffSong()
            }
        })
    }
    
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
        backgroundColor: '#00000000',
        padding: '10px'
    }

    return (
        <>
            {!music && <Html>
                <div className='play'><button onClick={playMusic} style={playStyle}>Play</button></div>
            </Html>}
            <mesh dispose={null} ref={meshRef} material={material} >
                <boxGeometry args={[2, 2, 0.1]} />
            </mesh>
        </>
    )
}