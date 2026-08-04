import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { Mascot } from "./Mascot";

type MascotSceneProps = { pose: number; reducedMotion?: boolean };

export default function MascotScene({ pose, reducedMotion }: MascotSceneProps) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0.4, 6.7], fov: 35 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 6, 5]} intensity={3.2} color="#fff4e8" />
      <pointLight position={[-4, 1, 3]} intensity={2.4} color="#2EC4B6" />
      <pointLight position={[3, -1, 3]} intensity={1.5} color="#FF6B35" />
      <Mascot pose={pose} reducedMotion={reducedMotion} />
      <ContactShadows position={[0, -2.08, 0]} opacity={0.25} scale={4.5} blur={2.8} far={4} />
    </Canvas>
  );
}
