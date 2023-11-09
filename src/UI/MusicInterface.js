import './musicInterface.css'
import useShader from "../stores/useShader";
import { useEffect, useRef } from "react";
import { addEffect } from '@react-three/fiber';

export default function MusicInterface()
{
    const songStatus = useShader(state => state.songPlaying)
    const getSongTime = useShader(state => state.getSongTime)
    
    console.log(songStatus)
    const time = useRef()
    const progress = useRef()

    const timeDisplay = (e) => 
    {
        const m = Math.floor(e % 3600 / 60).toString().padStart(2,'0')
        const s = Math.floor(e % 60).toString().padStart(2,'0')
        return m + ':' + s;
    }

    useEffect(() =>
    {
        const unsubscribeEffect = addEffect(() =>
        {   
            let elapsedTime = 0
            const startTime = getSongTime()
            if(songStatus === true)
            {
                elapsedTime = 0   
            }

            elapsedTime = Date.now() - startTime
            elapsedTime /= 1000

            if(time.current && elapsedTime > 0 && elapsedTime <= 137){
                time.current.textContent = timeDisplay(elapsedTime)
                progress.current.style.width = ((elapsedTime/137) * 100) + '%'
            }
        })

        return () =>
        {
            unsubscribeEffect()
        }
    }, [])

    return <>
        <div className="interface">
            {/* {songStatus && <div className="start" onClick={startSong}>start</div> } */}
            <div className="song">song: new adventure</div>
            <div className="artist">artist: matrika </div>
            <div id='Progress_Status'>
                <div className="progress" ref={progress}></div>
            </div>
            <div className="time" ref={time}>00:00</div>
        </div>
    </>
}