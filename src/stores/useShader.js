import { create } from 'zustand'

export default create((set, get) => 
{
    return {
        currentShader: 200,

        setCurrentShader: (val) => 
        {
            set((state) => ({currentShader: val}))
        }
    }
})