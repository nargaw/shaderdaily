import './style.css'
import { Canvas } from '@react-three/fiber'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Model } from './Background'
import { OrbitControls } from '@react-three/drei'
import Interface from './UI/Interface'

const root = createRoot(document.querySelector('#root'))

root.render(
    <StrictMode>
        <Canvas className="webgl" camera={{fov: 50, aspect: window.innerWidth/window.innerHeight, near: 0.01, far: 1000, position: [0, 0, 5]}}>
            <App />
            {/* <OrbitControls /> */}
            <Model />
        </Canvas>
        <Interface />
    </StrictMode>
)