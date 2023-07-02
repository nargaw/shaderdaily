import { useGLTF, Stage, Environment } from "@react-three/drei";
import { useEffect } from "react";

export default function Display()
{
    const model = useGLTF('./Models/tv.glb')
    console.log(model)

    useEffect(() => {
        if(model){
            // model.castShadow = true
            model.scene.traverse(o => {
                if(o.isMesh)
                {
                    // console.log(o.name)
                    o.castShadow = true
                    o.scale.x = 15
                    o.scale.y = 15
                    o.scale.z = 15
                }

            })
        }
    })

    return <>
        <Stage intensity={0.5} shadows="contact" environment={null}>
            <Environment 
                background={false}
                files={'1k.hdr'}
                path={'./HDR/'}
            />
            <primitive object={model.scene}  />
        </Stage>
    </>
}