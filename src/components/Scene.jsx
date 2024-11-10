import {
  AccumulativeShadows,
  Environment,
  Lightformer,
  OrbitControls,
  PerspectiveCamera,
  RandomizedLight,
  Sphere,
  useGLTF,
} from "@react-three/drei";

import * as THREE from "three";

import React, { useEffect } from "react";
import { DEG2RAD } from "three/src/math/MathUtils";

//Scene: 3d씬을 렌더링하는 컴포넌트, 여러가지 3d요소들을 배치하고 조명효과를 적용한다
//mainColor: 씬의 주요 색상 path:로드할 .glb모델 파일 경로
export const Scene = ({ mainColor, path, ...props }) => {
  const { nodes, materials, scene } = useGLTF(path); //useGLTF이용하여 path에 위치한 .glb파일을 로드함
  /**3d모델을 로드 후, 모델 내의 모든 mesh객체들에 그림자 처리를 추가한다. */
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; //castShadow: 객체가 그림자를 투사하도록 설정
        child.receiveShadow = true; //receiveShadow: 객체가 그림자를 받을 수 있도록 설정
      }
    });
  }, [scene]);
  //화면 크기에 맞게 씬의 크기를 비례적으로 조정, 다양한 화면 크기에서 최적화된 렌더링을 할 수 있게함
  const ratioScale = Math.min(1.2, Math.max(0.5, window.innerWidth / 1920));
  return (
    <>
      <color attach="background" args={["#ffffff"]} />
      <group {...props} dispose={null}>
        {/*PerspectiveCamera: 원근 카메라 사용, 3d씬을 렌더링, 
        near: 카메라의 근거리 클리핑 평면을 설정-> 얼마나 가까운 객체까지 렌더링 할지 결정   */}
        <PerspectiveCamera makeDefault position={[3, 3, 8]} near={0.5} />
        {/*OrbitControls: 카메라 제어를 위한 컴포넌트, 씬을 확대축소 회전 할 수 있게 도와줌  */}
        <OrbitControls
          autoRotate //카메라 자동회전
          enablePan={false} //팬 (이동) 기능을 비활성화
          maxPolarAngle={DEG2RAD * 75} //카메라의 수직 회전 제한
          minDistance={6} //minDistance,maxDistance: 카메라의 최소 및 최대 거리
          maxDistance={10}
          autoRotateSpeed={0.5} //자동회전속도
        />
        {/* 로드된 .glb모델을 씬에 렌더링 */}
        <primitive object={scene} scale={ratioScale} />
        {/*ambientLight: 씬 전체적으로 은은한 조명 추가, 색상은 핑크 */}
        <ambientLight intensity={0.1} color="pink" />
        {/*AccumulativeShadows: 그림자 효과 누적시켜 렌더링하는 컴포넌트  */}
        <AccumulativeShadows
          frames={100} //100프레임 동안 그림자 누적
          // alphaTest,opacity: 그림자의 투명도 설정
          alphaTest={0.9} //바닥의 투명도
          scale={30}
          position={[0, -0.005, 0]}
          color="pink"
          opacity={0.8} //높을 수록 그림자 강해짐
        >
          {/* RandomizedLight: 여러개의 랜덤한 광원들을 씬에 추가, 그림자와 반사들 다채롭게 만듬 */}
          <RandomizedLight
            amount={4}
            radius={9}
            intensity={0.8}
            ambient={0.25}
            position={[10, 5, 15]}
          />
          <RandomizedLight
            amount={4}
            radius={5}
            intensity={0.5}
            position={[-5, 5, 15]}
            bias={0.001}
          />
        </AccumulativeShadows>

        {/*Environment: 환경조명과 배경을 설정하는 컴포넌트  */}
        <Environment blur={0.8} background>
          {/*Sphere: 배경의 구체를 설정함  */}
          <Sphere scale={15}>
            <meshBasicMaterial color={mainColor} side={THREE.BackSide} />
          </Sphere>
          <Lightformer
            position={[5, 0, -5]}
            form="rect" // circle | ring | rect (optional, default = rect)
            intensity={1} // power level (optional = 1)
            color="red" // (optional = white)
            scale={[3, 5]} // Scale it any way you prefer (optional = [1, 1])
            target={[0, 0, 0]}
          />

          <Lightformer
            position={[-5, 0, 1]}
            form="circle" // circle | ring | rect (optional, default = rect)
            intensity={1} // power level (optional = 1)
            color="green" // (optional = white)
            scale={[2, 5]} // Scale it any way you prefer (optional = [1, 1])
            target={[0, 0, 0]}
          />

          <Lightformer
            position={[0, 5, -2]}
            form="ring" // circle | ring | rect (optional, default = rect)
            intensity={0.5} // power level (optional = 1)
            color="orange" // (optional = white)
            scale={[10, 5]} // Scale it any way you prefer (optional = [1, 1])
            target={[0, 0, 0]}
          />
          <Lightformer
            position={[0, 0, 5]}
            form="rect" // circle | ring | rect (optional, default = rect)
            intensity={1} // power level (optional = 1)
            color="purple" // (optional = white)
            scale={[10, 5]} // Scale it any way you prefer (optional = [1, 1])
            target={[0, 0, 0]}
          />
        </Environment>
      </group>
    </>
  );
};

useGLTF.preload("/models/cybertruck_scene.glb");
useGLTF.preload("/models/model3_scene.glb");
useGLTF.preload("/models/semi_scene.glb");
