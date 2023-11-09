import { create } from 'zustand'

export default create((set, get) => 
{
    return {
        currentShader: Math.floor(Math.random() * 600) + 1,

        information: false,

        total: 0,

        songPlaying: false,

        songStartTime: 0,

        songStatus: 'off',

        startSong: () =>
        {
            set((state) => ({songStatus: 'playing'}))
            set((state) => ({songStartTime: Date.now()}))
            set((state) => ({songPlaying: true}))
            return get().songStartTime
        },

        getSongTime: () => {
            return get().songStartTime
        },

        setSongOn: () => 
        {
            
        },

        setSongOff: () => 
        {
            set((state) => ({songStartTime: 0}))
        },

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