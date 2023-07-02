import './style.css'
import { Canvas } from '@react-three/fiber'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = createRoot(document.querySelector('#root'))

root.render(
    <StrictMode>
        <Canvas camera={{fov: 70, aspect: window.innerWidth/window.innerHeight, near: 0.01, far: 10000, position: [0, 0, 10.25]}}>
            <App />
        </Canvas>
    </StrictMode>
)