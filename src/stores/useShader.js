import { create } from 'zustand'

export default create((set, get) => 
{
    return {
        currentShader: 500,

        setCurrentShader: (val) => 
        {
            set((state) => ({currentShader: val}))
        }
    }
})