import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { soundEngine } from '../../utils/audio';

function MonitorPanel({ 
  children, 
  position, 
  rotation, 
  isCenter = false, 
  glowColor 
}: { 
  children: React.ReactNode, 
  position: [number, number, number], 
  rotation?: [number, number, number], 
  isCenter?: boolean,
  glowColor: string
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.04 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 1 - Math.exp(-6 * delta));
  });

  return (
    <group 
      position={position} 
      rotation={rotation} 
      ref={groupRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        soundEngine.playHover();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      <RoundedBox args={isCenter ? [1.9, 1.25, 0.08] : [1.7, 1.15, 0.08]} radius={0.04} smoothness={4} castShadow>
        <meshStandardMaterial 
          color="#080d14" 
          metalness={0.9} 
          roughness={0.2} 
          emissive={glowColor}
          emissiveIntensity={hovered ? 0.25 : 0}
        />
      </RoundedBox>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={isCenter ? [1.78, 1.12] : [1.58, 1.02]} />
        <meshBasicMaterial color={isCenter ? "#03080e" : "#040910"} />
      </mesh>
      
      <group position={[0, 0, 0]}>
        {children}
      </group>
      
      {/* Stand */}
      <mesh position={[0, isCenter ? -0.66 : -0.62, 0]}>
        <cylinderGeometry args={[isCenter ? 0.045 : 0.04, isCenter ? 0.045 : 0.04, isCenter ? 0.45 : 0.42, 16]} />
        <meshStandardMaterial color="#1a2432" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, isCenter ? -0.88 : -0.82, 0.05]}>
        <boxGeometry args={[isCenter ? 0.48 : 0.42, 0.03, isCenter ? 0.32 : 0.28]} />
        <meshStandardMaterial color="#111822" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}

export function Monitors() {
  const roboticsMeshRef = useRef<THREE.Group>(null);
  const chartRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (roboticsMeshRef.current) {
      roboticsMeshRef.current.rotation.y += delta * 0.8;
      roboticsMeshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
    if (chartRef.current) {
      chartRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  return (
    <group position={[0, 0.95, -0.6]}>
      {/* LEFT MONITOR: C# / ASP.NET CORE CODE */}
      <MonitorPanel position={[-1.75, 0.05, 0.18]} rotation={[0, 0.28, 0]} glowColor="#67c9ff">
        <Text position={[-0.72, 0.42, 0.05]} fontSize={0.065} color="#67c9ff" anchorX="left">
          BackendAPI.cs // .NET 8
        </Text>
        <Text
          position={[-0.72, 0.18, 0.05]}
          maxWidth={1.44}
          fontSize={0.046}
          color="#e2e8f0"
          anchorX="left"
          lineHeight={1.4}
        >
          {`[HttpPost("telemetry")]\npublic async Task<IActionResult> Dispatch(\n    [FromBody] RoverPacket packet) {\n    await _mediator.Send(new LogTelemetryCmd(packet));\n    await _hub.Clients.All.SendAsync("Update", packet);\n    return Ok(new { Status = "Dispatched" });\n}`}
        </Text>
      </MonitorPanel>

      {/* CENTER MONITOR: 3D ROBOTICS & ROS TELEMETRY */}
      <MonitorPanel position={[0, 0.12, 0]} isCenter glowColor="#ff8a30">
        <Text position={[-0.8, 0.46, 0.05]} fontSize={0.065} color="#ff8a30" anchorX="left">
          ROS_CORE // AUTONOMOUS ROVER 3D
        </Text>
        {/* Real rotating 3D wireframe robotics model inside screen viewport */}
        <group ref={roboticsMeshRef} position={[0, -0.05, 0.08]} scale={0.42}>
          <mesh>
            <boxGeometry args={[1.2, 0.45, 0.9]} />
            <meshStandardMaterial color="#ff8a30" wireframe />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
            <meshStandardMaterial color="#67c9ff" wireframe />
          </mesh>
          {[-0.6, 0.6].map((x) =>
            [-0.45, 0.45].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, -0.22, z]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.18, 0.18, 0.14, 16]} />
                <meshStandardMaterial color="#a855f7" wireframe />
              </mesh>
            ))
          )}
        </group>
        <Text position={[0, -0.44, 0.05]} fontSize={0.042} color="#64748b" anchorX="center">
          LIDAR: ACTIVE // SLAM: 99.8% CONFIDENCE // 120 FPS
        </Text>
      </MonitorPanel>

      {/* RIGHT MONITOR: SYSTEM ARCHITECTURE & PERFORMANCE */}
      <MonitorPanel position={[1.75, 0.05, 0.18]} rotation={[0, -0.28, 0]} glowColor="#38bdf8">
        <Text position={[-0.72, 0.42, 0.05]} fontSize={0.065} color="#38bdf8" anchorX="left">
          CLUSTER_METRICS // K8S & SQL
        </Text>
        {/* Animated Bar Telemetry */}
        <group ref={chartRef} position={[-0.55, 0.05, 0.05]}>
          {[0.35, 0.7, 0.5, 0.85, 0.6, 0.9, 0.75].map((h, i) => (
            <mesh key={i} position={[i * 0.18, h * 0.35, 0]}>
              <boxGeometry args={[0.1, h * 0.7, 0.01]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#ff8a30' : '#38bdf8'} />
            </mesh>
          ))}
        </group>
        <Text
          position={[-0.72, -0.32, 0.05]}
          maxWidth={1.44}
          fontSize={0.045}
          color="#94a3b8"
          anchorX="left"
          lineHeight={1.4}
        >
          {`CPU LOAD: 28%  |  RAM: 14.2 GB\nSQL IOPS: 4,820/s  |  LATENCY: 4ms`}
        </Text>
      </MonitorPanel>
    </group>
  );
}
