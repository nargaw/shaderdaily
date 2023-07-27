import './style.css'
import { Canvas } from '@react-three/fiber'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Model } from './Background'
import { OrbitControls } from '@react-three/drei'

const root = createRoot(document.querySelector('#root'))

root.render(
    <StrictMode>
        <Canvas camera={{fov: 50, aspect: window.innerWidth/window.innerHeight, near: 0.01, far: 100, position: [0, 0, 1.5]}}>
            <App />
            {/* <OrbitControls /> */}
            <Model />
        </Canvas>
    </StrictMode>
)