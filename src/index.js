import './style.css'
import { Canvas } from '@react-three/fiber'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = createRoot(document.querySelector('#root'))

root.render(
    <StrictMode>
        <Canvas camera={{fov: 70, near: 0.1, far: 1000, position: [0, 0, 1]}}>
            <App />
        </Canvas>
    </StrictMode>
)