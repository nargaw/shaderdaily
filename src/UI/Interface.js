import { useId } from "react";
import useShader from "../stores/useShader";

export default function Interface()
{

    const currentShader = useShader(state => state.currentShader)
    // console.log(currentShader)

    const setShader = useShader(state => state.setCurrentShader)
    // setShader(430)

    const goNext = () => {
        // console.log('next')
        let current = currentShader
        setShader(current + 1)
    }

    const goBack = () => {
        // console.log('back')
        let current = currentShader
        setShader(current - 1)
    }
   
    function handleSubmit(e){
        e.preventDefault()

        const form = e.target
        const formData = new FormData(form)
        const formJson = Object.fromEntries(formData.entries())
        
        // console.log(formJson.shader)
        const num = parseInt(formJson.shader)
        // console.log(num)
        // if(num !== isNaN()){
        //     console.log('yes')
            
        // }
        setShader(num) 
        document.getElementById("myForm").reset()

        document.addEventListener("wheel", function(event){
            if(document.activeElement.type === "number"){
                document.activeElement.blur();
            }
        });

    }
    return(
        <>
            <div className="nav">
                <button className="back" onClick={goBack}>back</button>
                <button className="next" onClick={goNext}>next</button>
                <h1 className="current">{currentShader}</h1>
            </div>
            
            
            <form id='myForm' className="form" onSubmit={handleSubmit}>
                <input type="number" name="shader" placeholder="Enter Shader Number" className="input" />
                <input type="submit"  value="Submit" className="submit"/>
            </form>
            
        </>
    )
}