import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

type MascotProps = { pose: number; reducedMotion?: boolean };

export function Mascot({ pose, reducedMotion }: MascotProps) {
  const root = useRef<Group>(null);
  const arm = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!root.current || !arm.current) return;
    const time = state.clock.elapsedTime;
    const targetRotation = [-0.12, 0.16, -0.18, 0.2, 0.08][pose] ?? 0;
    root.current.rotation.y += (targetRotation - root.current.rotation.y) * Math.min(delta * 4, 1);
    root.current.position.y = reducedMotion ? 0 : Math.sin(time * 1.35) * 0.055;
    arm.current.rotation.z += ((pose === 1 || pose === 4 ? -0.82 : -0.38) - arm.current.rotation.z) * Math.min(delta * 5, 1);
  });

  return (
    <group ref={root} scale={0.92} position={[0, -0.45, 0]}>
      <group position={[0, 0.22, 0]}>
        <RoundedBox args={[1.15, 1.5, 0.72]} radius={0.24} smoothness={3}>
          <meshStandardMaterial color="#142235" roughness={0.6} metalness={0.12} />
        </RoundedBox>
        <mesh position={[0, 0.15, 0.385]}>
          <circleGeometry args={[0.2, 6]} />
          <meshStandardMaterial color="#FF6B35" roughness={0.45} />
        </mesh>
        <mesh position={[0, -0.35, 0.39]} scale={[0.4, 0.045, 0.04]}>
          <boxGeometry />
          <meshStandardMaterial color="#2EC4B6" />
        </mesh>
      </group>

      <group position={[0, 1.42, 0]}>
        <mesh castShadow>
          <dodecahedronGeometry args={[0.63, 1]} />
          <meshStandardMaterial color="#F6F1E8" roughness={0.72} flatShading />
        </mesh>
        <mesh position={[0, 0.04, 0.53]} scale={[0.68, 0.24, 0.11]}>
          <boxGeometry />
          <meshStandardMaterial color="#172033" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[-0.17, 0.05, 0.65]}>
          <circleGeometry args={[0.035, 12]} />
          <meshBasicMaterial color="#2EC4B6" />
        </mesh>
        <mesh position={[0.17, 0.05, 0.65]}>
          <circleGeometry args={[0.035, 12]} />
          <meshBasicMaterial color="#2EC4B6" />
        </mesh>
      </group>

      <group ref={arm} position={[-0.69, 0.56, 0]} rotation={[0, 0, -0.38]}>
        <RoundedBox args={[0.3, 1.05, 0.34]} radius={0.13} smoothness={2} position={[0, -0.45, 0]}>
          <meshStandardMaterial color="#FF6B35" roughness={0.58} />
        </RoundedBox>
        <mesh position={[0, -1.02, 0]}>
          <sphereGeometry args={[0.18, 12, 8]} />
          <meshStandardMaterial color="#F6F1E8" flatShading />
        </mesh>
      </group>

      <group position={[0.7, 0.48, 0.02]} rotation={[0, 0, 0.45]}>
        <RoundedBox args={[0.3, 1, 0.34]} radius={0.13} smoothness={2} position={[0, -0.4, 0]}>
          <meshStandardMaterial color="#FF6B35" roughness={0.58} />
        </RoundedBox>
      </group>

      <group position={[0.25, -0.9, 0.08]}>
        <RoundedBox args={[0.44, 1.22, 0.5]} radius={0.16} smoothness={2} position={[0, -0.52, 0]}>
          <meshStandardMaterial color="#172033" roughness={0.7} />
        </RoundedBox>
      </group>
      <group position={[-0.25, -0.9, 0.08]}>
        <RoundedBox args={[0.44, 1.22, 0.5]} radius={0.16} smoothness={2} position={[0, -0.52, 0]}>
          <meshStandardMaterial color="#172033" roughness={0.7} />
        </RoundedBox>
      </group>

      <group position={[0.28, 0.06, 0.72]} rotation={[-0.08, -0.12, 0.02]}>
        <RoundedBox args={[1.16, 0.78, 0.11]} radius={0.1} smoothness={3}>
          <meshStandardMaterial color="#24364E" metalness={0.35} roughness={0.32} />
        </RoundedBox>
        <mesh position={[0, 0, 0.062]}>
          <planeGeometry args={[0.94, 0.57]} />
          <meshBasicMaterial color="#0E1726" />
        </mesh>
        <mesh position={[-0.22, 0.1, 0.068]} scale={[0.3, 0.055, 0.02]}>
          <boxGeometry />
          <meshBasicMaterial color="#FF6B35" />
        </mesh>
        <mesh position={[0.14, -0.08, 0.068]} scale={[0.45, 0.035, 0.02]}>
          <boxGeometry />
          <meshBasicMaterial color="#2EC4B6" />
        </mesh>
      </group>
    </group>
  );
}
