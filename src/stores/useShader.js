import { create } from 'zustand'

export default create((set, get) => 
{
    return {
        currentShader: 602,

        information: false,

        setCurrentShader: (val) => 
        {
            set((state) => ({currentShader: val}))
        },

        activateInformation: () => 
        {
            set((state) => ({information: true}))
        },

        deactivateInformation: () =>
        {
            set((state) => ({information: false}))
        }
    }
})