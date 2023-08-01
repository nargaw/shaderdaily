

import React, { useRef } from "react";
import { useGLTF, useTexture, useFBX } from "@react-three/drei";
import * as THREE from 'three'

export function Model(props) {
  const model2 = useFBX("./Models/warehouse2/source/WareHouse.fbx");
  const color = useTexture("./Models/warehouse2/textures/Bake.jpg")
  const texture = useTexture("./Models/warehouse2/textures/Tx.jpg")
  color.flipY = true
  texture.flipY = false
  const normal = new THREE.MeshNormalMaterial()
  const material = new THREE.MeshStandardMaterial({
    // map: diffuse,
    map: color,
    aoMap: texture,
    // aoMapIntensity: 0.1,
    // specularMap: texture
    
  })

  console.log(model2)
  
  return (
    <group {...props} dispose={null}>
        <group position={[0, -25, 50]} >
            <mesh 
                geometry={model2.children[0].children[1].geometry}
                material={material}
            />
            <mesh 
                geometry={model2.children[0].children[0].children[1].geometry}
                material={material}
            />
            <mesh 
                geometry={model2.children[0].children[0].children[0].children[0].geometry}
                material={material}
            />
            <mesh 
                geometry={model2.children[1].geometry}
                material={material}
            />
            <mesh 
                geometry={model2.children[2].geometry}
                material={material}
            />
        </group>
        <ambientLight intensity={0.2}/>
        <rectAreaLight position={[0, 0, -80]} intensity={30} />
    </group>
  );
}

// useGLTF.preload("./Models/warehouse/scene.gltf");



