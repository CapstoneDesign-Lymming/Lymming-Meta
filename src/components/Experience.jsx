import {
  CameraControls,
  Dodecahedron,
  Environment,
  Grid,
  MeshDistortMaterial,
  RenderTexture,
} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useControls } from "leva";
import { useEffect, useRef } from "react";
import { slideAtom } from "./Overlay";
import { Scene } from "./Scene";

export const scenes = [
  {
    path: "models/Scene1.glb",
    mainColor: "#f9c0ff",
    name: "2024년 대동제 웹사이트",
    description: "한림대학교 대동제를 위해 준비한 프로젝트입니다.",
    people: ["노기훈", "지우림", "박준서", "김대성", "김선우"],
    range: 660,
  },
  {
    path: "models/Scene2.glb",
    mainColor: "#c0ffe1",
    name: "리밍",
    description:
      "리밍을 통해 잘 맞는 사람을 찾고 쉽게 프로젝트를 시작 해보세요.",
    people: ["노기훈", "지우림", "박준서"],
    range: 576,
  },
  {
    path: "models/Scene3.glb",
    mainColor: "#ffdec0",
    name: "Quizza",
    description: "스스로 문제를 제출하고 평가하기 위한 최적의 웹사이트",
    people: ["노기훈"],
    range: 800,
  },
];

const CameraHandler = ({ slideDistance }) => {
  const viewport = useThree((state) => state.viewport);
  const cameraControls = useRef();
  const [slide] = useAtom(slideAtom);
  const lastSlide = useRef(0);

  const { dollyDistance } = useControls({
    dollyDistance: {
      value: 10,
      min: 0,
      max: 50,
    },
  });

  /**setLookAt 메서드: 카메라의 위치(x, y, z)와 카메라가 바라볼 목표 위치(targetX, targetY, targetZ)를 설정합니다*/
  const moveToSlide = async () => {
    //밑의 CameraControls를 제어
    await cameraControls.current.setLookAt(
      lastSlide.current * (viewport.width + slideDistance),
      3,
      dollyDistance,
      lastSlide.current * (viewport.width + slideDistance),
      0,
      0,
      true
    );
    await cameraControls.current.setLookAt(
      (slide + 1) * (viewport.width + slideDistance),
      1,
      dollyDistance,
      slide * (viewport.width + slideDistance),
      0,
      0,
      true
    );

    await cameraControls.current.setLookAt(
      slide * (viewport.width + slideDistance),
      0,
      5,
      slide * (viewport.width + slideDistance),
      0,
      0,
      true
    );
  };

  //처음 앱 진입시 카메라 포지션 세팅
  useEffect(() => {
    // Used to reset the camera position when the viewport changes
    const resetTimeout = setTimeout(() => {
      cameraControls.current.setLookAt(
        slide * (viewport.width + slideDistance),
        0,
        5,
        slide * (viewport.width + slideDistance),
        0,
        0
      );
    }, 200);
    return () => clearTimeout(resetTimeout);
  }, [viewport]);

  useEffect(() => {
    if (lastSlide.current === slide) {
      return;
    }
    moveToSlide();
    lastSlide.current = slide;
  }, [slide]);
  return (
    <CameraControls
      ref={cameraControls}
      touches={{
        one: 0,
        two: 0,
        three: 0,
      }}
      mouseButtons={{
        left: 0,
        middle: 0,
        right: 0,
      }}
    />
  );
};

export const Experience = () => {
  //useThree훅 사용하여 현재 뷰포트의 크기를 가져온다.
  const viewport = useThree((state) => state.viewport);
  const { slideDistance } = useControls({
    slideDistance: {
      value: 1,
      min: 0,
      max: 10,
    },
  });
  return (
    <>
      {/*ambientLight: 조명, intensity: 빛의 강도  */}
      <ambientLight intensity={0.2} />
      {/* city 프리셋 환경 적용, 3d씬에 배경과 환경 조명을 자동으로 설정 */}
      <Environment preset={"city"} />
      {/*slideDistance값을 받아와서 카메라의 디옹이나 회전을 제어함  */}
      <CameraHandler slideDistance={slideDistance} />
      {/* 화면  전환시 디스플레이 위에 뜨는 도형 정의 */}
      <group>
        <mesh position-y={viewport.height / 2 + 1.5}>
          <sphereGeometry args={[1, 32, 32]} />
          <MeshDistortMaterial color={scenes[0].mainColor} speed={3} />
        </mesh>

        <mesh
          position-x={viewport.width + slideDistance}
          position-y={viewport.height / 2 + 1.5}
        >
          <boxGeometry />
          <MeshDistortMaterial color={scenes[1].mainColor} speed={3} />
        </mesh>

        <Dodecahedron
          position-x={2 * (viewport.width + slideDistance)}
          position-y={viewport.height / 2 + 1.5}
        >
          <MeshDistortMaterial color={scenes[2].mainColor} speed={3} />
        </Dodecahedron>
      </group>
      {/*평면 정의*/}
      <Grid
        position-y={-viewport.height / 2} //그리드y축 설정, 화명 중앙에서 아래쪽으로 배치
        sectionSize={1} //구획의 크기(타일의 크기), 일정한 간격으로 구획들로 나누어짐
        sectionColor={"purple"}
        sectionThickness={1} //구획의 두께
        cellSize={0.5} //그리드 각 셀의 크기(구획을 세분화)
        cellColor={"#6f6f6f"}
        cellThickness={0.6}
        infiniteGrid //그리드를 무한히 반복하도록 설정. 끝이 화면애 닿으면서 자동으로 그리드 반복
        //그리드의 페이드 효과(사라지는 효과) 시작되는 거리 설정, 화면에서 멀어질 수록 흐릿해지고 사라지는 느낌, 지평선을 정의한다고 생각하면 편함
        fadeDistance={50}
        fadeStrength={5} //그리드의 페이드 강도를 설정
      />
      {scenes.map((scene, index) => (
        <mesh
          key={index}
          position={[index * (viewport.width + slideDistance), 0, 0]}
        >
          {/* 디스플레이 화면 정의 */}
          <planeGeometry args={[viewport.width, viewport.height]} />
          {/* 기본적인 재질을 설정하는 컴포넌트, toneMapped: 톤 매핑 사용 x */}
          <meshBasicMaterial toneMapped={false}>
            {/* 다른 씬의 렌더링 결과를 텍스처로 받아와서 현재 3d객체에 입힐 때 사용함, map텍스처로 적용, 텍스처를 평면에 입힐 때 사용함  */}
            <RenderTexture attach="map">
              <Scene {...scene} />
            </RenderTexture>
          </meshBasicMaterial>
        </mesh>
      ))}
    </>
  );
};
