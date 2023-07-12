import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OrbitControls } from '@react-three/drei'

import Shader568 from './shaders/568/fragment.js'
import Shader569 from './shaders/569/fragment.js'
import Shader570 from './shaders/570/fragment.js'
import Shader571 from './shaders/571/fragment.js'
import Shader572 from './shaders/572/fragment.js'
import Shader573 from './shaders/573/fragment.js'
import Shader574 from './shaders/574/fragment.js'
import Shader575 from './shaders/575/fragment.js'
import Shader576 from './shaders/576/fragment.js'
import Shader577 from './shaders/577/fragment.js'
import Shader578 from './shaders/578/fragment.js'
import Shader579 from './shaders/579/fragment.js'
import Shader580 from './shaders/580/fragment.js'
import Shader581 from './shaders/581/fragment.js'
import Shader582 from './shaders/582/fragment.js'
import Shader583 from './shaders/583/fragment.js'
import Shader584 from './shaders/584/fragment.js'
import Shader585 from './shaders/585/fragment.js'
import Shader586 from './shaders/586/fragment.js'
import Shader587 from './shaders/587/fragment.js'
import Shader588 from './shaders/588/fragment.js'
import Shader589 from './shaders/589/fragment.js'

export default function App()
{

    const list = [
        <Shader568 />,
        <Shader569 />,
        <Shader570 />,
        <Shader571 />,
        <Shader572 />,
        <Shader573 />,
        <Shader574 />,
        <Shader575 />,
        <Shader576 />,
        <Shader577 />,
        <Shader578 />,
        <Shader579 />,
        <Shader580 />,
        <Shader581 />,
        <Shader582 />,
        <Shader583 />,
        <Shader584 />,
        <Shader585 />,
        <Shader586 />,
        <Shader587 />,
        <Shader588 />,
        <Shader589 />
    ]

    return (
        <>
            {/* <OrbitControls /> */}
            <BrowserRouter>
                <Routes>
                    {/* <Route path='/'> */}
                        <Route index element={list[list.length - 1] } />
                        <Route path='569' element={<Shader569 />}/>
                        <Route path='570' element={<Shader570 />}/>
                        <Route path='571' element={<Shader571 />}/>
                        <Route path='572' element={<Shader572 />}/>
                        <Route path='573' element={<Shader573 />}/>
                        <Route path='574' element={<Shader574 />}/>
                        <Route path='575' element={<Shader575 />}/>
                        <Route path='576' element={<Shader576 />}/>
                        <Route path='577' element={<Shader577 />}/>
                        <Route path='578' element={<Shader578 />}/>
                        <Route path='579' element={<Shader579 />}/>
                        <Route path='580' element={<Shader580 />}/>
                        <Route path='581' element={<Shader581 />}/>
                        <Route path='582' element={<Shader582 />}/>
                        <Route path='583' element={<Shader583 />}/>
                        <Route path='584' element={<Shader584 />}/>
                        <Route path='585' element={<Shader585 />}/>
                        <Route path='586' element={<Shader586 />}/>
                        <Route path='587' element={<Shader587 />}/>
                        <Route path='588' element={<Shader588 />}/>
                        <Route path='589' element={<Shader589 />}/>
                    {/* </Route>  */}
                </Routes>
            </BrowserRouter>
        </>
    )
}