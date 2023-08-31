import useShader from "../stores/useShader";

export default function Interface()
{

    const currentShader = useShader(state => state.currentShader)
    console.log(currentShader)

    const setShader = useShader(state => state.setCurrentShader)
    // setShader(430)

    const goNext = () => {
        console.log('next')
        let current = currentShader
        setShader(current + 1)
    }

    const goback = () => {
        console.log('back')
        let current = currentShader
        setShader(current - 1)
    }
    return(
        <>
            <button className="back" onClick={goback}>back</button>
            <button className="next" onClick={goNext}>next</button>
            <h1 className="current">{currentShader}</h1>
        </>
    )
}