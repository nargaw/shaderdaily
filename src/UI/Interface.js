import { useId } from "react";
import useShader from "../stores/useShader";

export default function Interface()
{

    const currentShader = useShader(state => state.currentShader)
    // console.log(currentShader)

    const setShader = useShader(state => state.setCurrentShader)
    // setShader(430)

    const goNext = () => {
        
        let current = currentShader
        if(current < 601){
            setShader(current + 1)
            // console.log(current)
        }
        
    }

    const goBack = () => {
        // console.log('back')
        let current = currentShader
        if(current > 1){
            setShader(current - 1)
            // console.log(current)
        }
    }
   
    function handleSubmit(e){
        e.preventDefault()

        const form = e.target
        const formData = new FormData(form)
        const formJson = Object.fromEntries(formData.entries())
        
        // console.log(formJson.shader)
        const num = parseInt(formJson.shader)
        if(!Number.isNaN(num) && num > 0 && num < 602){
            setShader(num) 
        }

        document.getElementById("myForm").reset();
    }


    
    document.addEventListener("wheel", function(event){
        if(document.activeElement.type === "number"){
            document.activeElement.blur();
        }
    });


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