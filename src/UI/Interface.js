import { useId } from "react";
import useShader from "../stores/useShader";
import MusicInterface646 from "./MusicInterface646";
import MusicInterface647 from "./MusicInterface647";
import MusicInterface648 from "./MusicInterface648";

export default function Interface()
{

    const currentShader = useShader(state => state.currentShader)
    const setShader = useShader(state => state.setCurrentShader)

    const informationStatus = useShader(state => state.information)
    const infoActive = useShader(state => state.activateInformation)
    const infoDeactivate = useShader(state => state.deactivateInformation)

    const total = 655
    // console.log(total)
    
    const goNext = () => {
        
        let current = currentShader
        if(current < total){
            setShader(current + 1)
        }
        
    }

    const goBack = () => {
        let current = currentShader
        if(current > 1){
            setShader(current - 1)
        }
    }

    const random = () => {
        setShader(Math.floor(Math.random() * total) + 1)
    }
   
    function handleSubmit(e){
        e.preventDefault()

        const form = e.target
        const formData = new FormData(form)
        const formJson = Object.fromEntries(formData.entries())
        
        // console.log(formJson.shader)
        const num = parseInt(formJson.shader)
        if(!Number.isNaN(num) && num > 0 && num <= total){
            setShader(num) 
        }

        document.getElementById("myForm").reset();
    }


    const toggleInfo = () => {
        if(informationStatus === false){
            document.getElementsByClassName('webgl')[0].style.opacity = "0.15"
            document.getElementsByClassName('nav')[0].style.opacity = "0.025"
            document.getElementsByClassName('form')[0].style.opacity = "0.025"
            document.getElementsByClassName('icon')[0].style.opacity = "0.025"
            document.getElementsByClassName('random')[0].style.opacity = "0.025"
            infoActive()
        } 
    }

    const closeInfo = () => {
        document.getElementsByClassName('webgl')[0].style.opacity = "1.0"
        document.getElementsByClassName('nav')[0].style.opacity = "1.0"
        document.getElementsByClassName('form')[0].style.opacity = "1.0"
        document.getElementsByClassName('icon')[0].style.opacity = "1.0"
        document.getElementsByClassName('random')[0].style.opacity = "1.0"
        infoDeactivate()
    }


    
    document.addEventListener("wheel", function(event){
        if(document.activeElement.type === "number"){
            document.activeElement.blur();
        }
    });

    const handleEmail = () => {
        const email = 'nateargaw@gmail.com'
        navigator.clipboard.writeText(email)
        alert('Copied email: ' + email)
    }



    return(
        <>
            <div className="nav">
                {!informationStatus && <button className="back" onClick={goBack}>back</button>}
                {!informationStatus && <button className="next" onClick={goNext}>next</button>}
                <h1 className="current">{currentShader}</h1>
            </div>
            
            
            <form id='myForm' className="form" onSubmit={handleSubmit}>
                {!informationStatus && <input type="number" name="shader" placeholder="Enter Shader Number" className="input" />}
                {!informationStatus && <input type="submit"  value="Submit" className="submit"/>}
            </form>

            <div className="icon" onClick={toggleInfo}>
                <i className="fa-solid fa-info"></i>
            </div>

            <div className="random" onClick={random}>
                {!informationStatus && <i className="fa-solid fa-shuffle"></i>}
            </div>
            {currentShader === 646 && <MusicInterface646 />}
            {currentShader === 647 && <MusicInterface647 />}
            {currentShader === 648 && <MusicInterface648 />}
            {console.log(currentShader)}

            {
                informationStatus && <div className="container">
                    <div className="close" onClick={closeInfo}><i className="fa-solid fa-x"></i></div>
                    <h1 className="header">Welcome to Shader Daily!</h1>
                    <p className="text">
                        This website is a result of my personal journey towards learning the magic of Shaders. A shader is a computer program that uses a variety of specialized functions and algorithms to calculate the color value of each pixel in a rendered result using the graphics processing unit (GPU). Shaders are used in a variety of industries ranging from cinema to video games. The programming language used in shaders depends on the target environment. This target environment uses GLSL (Graphics Library Shader Language). This shader program requires a vertex shader and a fragment shader. The vertex shader is not manipulated in this website and kept standard for all results. The fragment shader is modified for each result. The rendering result and experience is achieved using Three.js and React-Three-Fiber. <br /> <br/> Thank you for visiting!<br/> <br/>Nate Argaw  <p className="copyright">© Shader Daily. All Rights Reserved</p>
                    </p>
                    <div className="contact">
                        <div className="mail" onClick={handleEmail}>
                            <a href="mailto: nateargaw@gmail.com"></a>
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                        <div className="twitter">
                            <a href="https://twitter.com/nate_dev_">
                                <i className="fa-brands fa-x-twitter"></i> 
                            </a>
                        </div>
                        <div className="linkedin">
                            <a href="https://www.linkedin.com/in/nateargaw/">
                                <i className="fa-brands fa-linkedin-in"></i>
                            </a>
                        </div>
                        <div className="instagram">
                            <a href="https://www.instagram.com/shaderdaily/">
                                <i className="fa-brands fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                    
                </div>
            }    
        </>
    )
}