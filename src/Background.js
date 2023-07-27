

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Model(props) {
  const { nodes, materials } = useGLTF("./Models/warehouse/scene.gltf");
  console.log(nodes)
  return (
    <group {...props} dispose={null}>
      
    </group>
  );
}

useGLTF.preload("./Models/gallery.glb");


