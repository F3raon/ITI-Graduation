import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import axios from 'axios';
import { soundEngine } from '../../utils/audio';

const ITI_SESSIONS = [
  "Session 1", "Session 2", "Session 3", "Session 4", 
  "Session 5", "Session 6", "Session 7", "Session 8", 
  "Session 9", "Session 10", "Session 12", "Session 13", 
  "Session 14", "Session 15", "Session 16", "Session 17", "Session 18"
];

function SessionModal({ sessionName, onClose }: { sessionName: string, onClose: () => void }) {
  const [projects, setProjects] = useState<{name: string, html_url: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    soundEngine.playSelect();
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`https://api.github.com/repos/F3raon/ITI-react.js-Assignments/contents/${encodeURIComponent(sessionName)}`);
        // Filter out files, keep directories (projects)
        const dirs = res.data.filter((item: any) => item.type === 'dir' || item.name.endsWith('.js') || item.name.endsWith('.html'));
        setProjects(dirs.length > 0 ? dirs : res.data); // Fallback to all files if no dirs
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [sessionName]);

  return (
    <Html center zIndexRange={[100, 0]} transform={false}>
      <div 
        className="backdrop-blur-xl border border-red-500/30 rounded-lg p-6 shadow-[0_0_40px_rgba(220,38,38,0.2)]"
        style={{
          background: 'rgba(5, 8, 12, 0.85)',
          width: '80vw',
          maxWidth: '500px',
          maxHeight: '70vh',
          overflowY: 'auto',
          color: 'white',
          fontFamily: 'sans-serif'
        }}
      >
        <div className="flex justify-between items-center mb-6 border-b border-red-500/20 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-red-500 m-0 uppercase tracking-wider">{sessionName}</h2>
            <p className="text-slate-400 text-sm mt-1 mb-0 uppercase tracking-widest">Select a project to enter</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); soundEngine.playHover(); onClose(); }}
            className="text-slate-400 hover:text-white transition-colors bg-transparent border-none text-2xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map(proj => (
              <a 
                key={proj.name}
                href={proj.html_url} 
                target="_blank" 
                rel="noreferrer"
                onMouseEnter={() => soundEngine.playHover()}
                onClick={() => soundEngine.playSelect()}
                className="group flex items-center justify-between p-4 bg-slate-900/50 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/50 rounded-md transition-all no-underline"
              >
                <div className="flex items-center gap-3">
                  <span className="text-red-400 group-hover:text-red-300">📁</span>
                  <span className="text-slate-200 group-hover:text-white font-medium">{proj.name}</span>
                </div>
                <span className="text-xs text-red-500/50 group-hover:text-red-400 font-bold tracking-widest">OPEN ↗</span>
              </a>
            ))}
            {projects.length === 0 && (
              <p className="text-slate-500 text-center py-4">No projects found in this session.</p>
            )}
          </div>
        )}
      </div>
    </Html>
  );
}

function Folder3DItem({ name, position, onClick }: { name: string; position: [number, number, number]; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (!ref.current) return;
    const targetScale = hovered ? 1.1 : 1;
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 1 - Math.exp(-8 * delta));
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, position[2] + (hovered ? 0.15 : 0), 1 - Math.exp(-8 * delta));
  });

  return (
    <group 
      ref={ref} 
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); soundEngine.playHover(); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      {/* Back Cover of Folder */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[1.2, 0.8, 0.02]} />
        <meshStandardMaterial color={hovered ? "#ef4444" : "#991b1b"} roughness={0.3} />
      </mesh>
      
      {/* Folder Tab */}
      <mesh position={[-0.4, 0.42, -0.04]}>
        <boxGeometry args={[0.35, 0.08, 0.02]} />
        <meshStandardMaterial color={hovered ? "#ef4444" : "#991b1b"} roughness={0.3} />
      </mesh>

      {/* White Paper Inside */}
      <mesh position={[0, 0.05, -0.01]}>
        <boxGeometry args={[1.1, 0.7, 0.01]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Front Flap of Folder (Tilted forward) */}
      <mesh position={[0, -0.05, 0.04]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[1.2, 0.7, 0.02]} />
        <meshStandardMaterial color={hovered ? "#f87171" : "#dc2626"} roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Label on Folder */}
      <Text position={[0, -0.1, 0.08]} fontSize={0.16} color="#ffffff" anchorX="center" fontWeight={800} letterSpacing={0.05}>
        {name.toUpperCase()}
      </Text>
    </group>
  );
}

export function ITIProjectsBranch({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  const [activeSession, setActiveSession] = useState<string | null>(null);

  return (
    <group position={position}>
      {/* Main Container Glass Panel */}
      <RoundedBox args={[5.2, 5.0, 0.1]} radius={0.08} smoothness={4} position={[0, -0.2, -0.1]} castShadow>
        <meshPhysicalMaterial
          color="#1e293b"
          metalness={0.6}
          roughness={0.25}
          clearcoat={1.0}
          transparent
          opacity={0.85}
        />
      </RoundedBox>

      {/* Header Text */}
      <Text position={[0, 1.9, 0.0]} fontSize={0.14} color="#f87171" anchorX="center" letterSpacing={0.2}>
        // ACADEMIC BRANCH
      </Text>
      <Text position={[0, 1.45, 0.0]} fontSize={0.4} color="#f8fafc" anchorX="center" fontWeight={900}>
        ITI ASSIGNMENTS
      </Text>
      <Text position={[0, 1.05, 0.0]} maxWidth={4.8} fontSize={0.1} color="#94a3b8" anchorX="center" lineHeight={1.5}>
        REACT.JS TRACK • CLICK ANY FOLDER TO VIEW INTERNAL PROJECTS
      </Text>

      {/* Grid of 3D Folders */}
      <group position={[0, 0, 0.05]}>
        {ITI_SESSIONS.map((session, i) => {
          // 3 Columns layout
          const col = i % 3;
          const row = Math.floor(i / 3);
          
          const x = (col - 1) * 1.5;
          const y = 0.5 - (row * 0.65); // Start at Y=0.5 and go down
          
          return (
            <Folder3DItem
              key={session}
              name={session}
              position={[x, y, 0]}
              onClick={() => setActiveSession(session)}
            />
          );
        })}
      </group>

      {/* Modal Overlay for displaying contents */}
      {activeSession && (
        <SessionModal sessionName={activeSession} onClose={() => setActiveSession(null)} />
      )}
    </group>
  );
}
