import './style.css'
import { Canvas } from '@react-three/fiber'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

const root = createRoot(document.querySelector('#root'))

root.render(
    <StrictMode>
        <Canvas>
            <App />
        </Canvas>
    </StrictMode>
)