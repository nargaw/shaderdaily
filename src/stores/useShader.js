import { create } from 'zustand'

export default create((set, get) => 
{
    return {
        currentShader: Math.floor(Math.random() * 600) + 1,

        information: false,

        total: 0,

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
        },

        setTotal: (val) =>
        {
            set((state) => ({total: val}))
        }
    }
})