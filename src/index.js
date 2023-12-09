import './style.css'
import { Canvas } from '@react-three/fiber'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Model } from './Background'
import { OrbitControls } from '@react-three/drei'
import Interface from './UI/Interface'
import Cleanup from './Cleanup'
import { Leva } from 'leva'

const root = createRoot(document.querySelector('#root'))

root.render(
    <StrictMode>
        <div 
                style={{
                    position: 'absolute',
                    top: '20vh',
                    left: '50vw',
                    transform: 'translate(-50%, -50%)',
                    zIndex: '1',
                    width: '250px',
                    height: '250px'
                }}
            >
            <Leva
                fill = {true}
                flat = {false} 
                titleBar = {true}
                collapsed = {true}
                drag = {true}
                hideCopyButton = {true}
            />
        </div>
        <Canvas className="webgl" camera={{fov: 50, aspect: window.innerWidth/window.innerHeight, near: 0.01, far: 1000, position: [0, 0, 5]}}>
            <App />
            {/* <OrbitControls /> */}
            <Model />
            <Cleanup />
        </Canvas>
        <Interface />
    </StrictMode>
)