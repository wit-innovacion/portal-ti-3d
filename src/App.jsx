import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, QuadraticBezierLine, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Server, Terminal, ShieldCheck, Rocket, ChevronLeft, Code, User, AlertTriangle, ArrowRight, X } from 'lucide-react';

// --- DATA ---
const companyAreas = [
  { id: 'admin', name: 'Administración & Gestión', color: '#f59e0b', people: ['Alejandro Gonzalez', 'Pablo Amarista', 'Alba Rodriguez', 'Lixandro Albarran', 'Gonzalo Tejeda', 'Andrea Cisterna', 'Randy Amaya', 'Maria Isabel Carrasco', 'Milibeth Garcia'] },
  { id: 'negocios', name: 'Negocios', color: '#10b981', people: ['Euro Paz', 'Luis Lara', 'Jose Tomas Goicoechea', 'Veronica Ponce de Leon'] },
  { id: 'proyectos', name: 'Implementación / Proyectos', color: '#8b5cf6', people: ['Marleen Juarez', 'Roberto Vargas', 'Ricardo Lorca', 'Hector Corredor', 'Catalina Alfaro', 'Angel Muñoz'] },
  { id: 'diseno', name: 'Diseño y Comunicación', color: '#ec4899', people: ['Alvaro Tejeda'] },
  { id: 'soporte', name: 'Soporte y Pos Venta', color: '#06b6d4', people: ['Mariangly Monsalve', 'Raul Contreras', 'Carolina Levipil', 'Alexandra Morales', 'Anggie Chevez', 'Ignacia Flores', 'Amanda Vidal', 'Mariangeles Yaraure', 'Mariana Lima'] },
  { id: 'id', name: 'I+D', color: '#f97316', people: ['Diego Wigodski', 'Jesus Sandoval'] },
  { id: 'ti', name: 'TI (Internal)', color: '#3b82f6', people: ['Ivan Valenzuela', 'Dorian Gonzalez', 'Luis Mendez', 'Rodrigo Valdebenito', 'Alejandro Ville', 'Luis Sanchez', 'Dominique Meza', 'Julyt Uribes', 'Ayelem Erices'] },
];

const macroNodes = [
  { id: 'recepcion', label: 'Recepción', position: [-4, 0, 0], icon: Server, color: '#0ea5e9' },
  { id: 'devops', label: 'DevOps', position: [-1.5, 2, -1], icon: Terminal, color: '#3b82f6' },
  { id: 'qa', label: 'QA', position: [1.5, -2, -1], icon: ShieldCheck, color: '#6366f1' },
  { id: 'produccion', label: 'Producción', position: [4, 0, 0], icon: Rocket, color: '#8b5cf6' },
];

const teamMembers = [
  { id: 't1', name: 'Dorian Gonzalez', github: 'dorian-cesar', role: 'Lidera arquitectura y aprueba pases a Prod.', targetNode: 'produccion', orbitRadius: 2.2, speed: 0.5, yOffset: 1, color: '#10b981' },
  { id: 't2', name: 'Diego Wigodski', github: 'diegowigo', role: 'Investigación y Desarrollo de herramientas', targetNode: 'recepcion', orbitRadius: 2.5, speed: 0.4, yOffset: -1.5, color: '#f59e0b' },
  { id: 't3', name: 'Diego Farias', github: 'D1Farias', role: 'Integración y Despliegue Continuo (CI/CD)', targetNode: 'devops', orbitRadius: 2.3, speed: 0.6, yOffset: 0.5, color: '#3b82f6' },
  { id: 't4', name: 'Luis Sanchez', github: 'HLCXPL', role: 'Desarrollo y Soporte de Infraestructura', targetNode: 'qa', orbitRadius: 2.4, speed: 0.45, yOffset: -0.5, color: '#8b5cf6' },
];

const macroConnections = [
  { start: 'recepcion', end: 'devops', control: [-3, 1.5, -0.5] },
  { start: 'recepcion', end: 'qa', control: [-2, -1.5, -0.5] },
  { start: 'devops', end: 'produccion', control: [2, 1.5, -0.5] },
  { start: 'qa', end: 'produccion', control: [3, -1.5, -0.5] },
];

// --- COMPONENTS ---
function Connections({ connections, nodes, color, isVisible }) {
  if (!isVisible) return null;
  return (
    <group>
      {connections.map((conn, idx) => {
        const startNode = nodes.find(n => n.id === conn.start);
        const endNode = nodes.find(n => n.id === conn.end);
        if (!startNode || !endNode) return null;
        return (
          <QuadraticBezierLine
            key={idx}
            start={startNode.position}
            end={endNode.position}
            mid={conn.control}
            color={color}
            lineWidth={2.5}
            transparent
            opacity={isVisible ? 0.6 : 0}
          />
        );
      })}
    </group>
  );
}

function NodeMesh({ position, color, isVisible, label, onClick, scale = 1, showLabel = true, yOffset = 0, hoverable = true, emissive = true }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + yOffset + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
    }
    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, isVisible ? 1 : 0, 0.05);
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, (hoverable && hovered) ? 0.5 : 0.2, 0.1);
    }
  });

  if (!isVisible) return <group position={position} ref={meshRef} />;

  return (
    <group position={position} ref={meshRef}>
      <mesh 
        onClick={(e) => { if(onClick){ e.stopPropagation(); onClick(); } }} 
        onPointerOver={() => { if(hoverable){ setHovered(true); document.body.style.cursor = 'pointer'; } }}
        onPointerOut={() => { if(hoverable){ setHovered(false); document.body.style.cursor = 'default'; } }}
        scale={scale}
      >
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial 
          ref={materialRef}
          color={color} 
          roughness={0.2}
          metalness={0.1}
          emissive={emissive ? color : '#000'}
          transparent
        />
      </mesh>
      {showLabel && (
        <Html position={[0, -0.8 * scale, 0]} center style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
          <div className="text-sm font-semibold text-slate-700 bg-white/80 px-2 py-1 rounded shadow-sm backdrop-blur-sm whitespace-nowrap border border-white/50">
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

function TeamMember({ member, isVisible }) {
  const meshRef = useRef();
  const materialRef = useRef();
  const [hovered, setHovered] = useState(false);
  const target = macroNodes.find(n => n.id === member.targetNode);

  useFrame((state) => {
    if (!isVisible) return;
    if (meshRef.current && target) {
      const time = state.clock.elapsedTime * member.speed + (member.orbitRadius * 10);
      const x = target.position[0] + Math.cos(time) * member.orbitRadius;
      const z = target.position[2] + Math.sin(time) * member.orbitRadius;
      const y = target.position[1] + member.yOffset + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      meshRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.1);
      meshRef.current.quaternion.copy(state.camera.quaternion);
    }
    if (materialRef.current) {
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, isVisible ? (hovered ? 0.9 : 0.6) : 0, 0.05);
    }
  });

  if (!isVisible && !meshRef.current) return null;

  return (
    <group ref={meshRef}>
      <mesh
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <planeGeometry args={[1, 0.4]} />
        <meshStandardMaterial 
          ref={materialRef}
          color={member.color} 
          transparent
          side={THREE.DoubleSide}
          emissive={member.color}
          emissiveIntensity={hovered ? 0.6 : 0.2}
        />
      </mesh>
      
      <Html position={[0, 0, 0]} center style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: hovered ? 'auto' : 'none' }} zIndexRange={[100, 0]}>
        <div 
          className={`flex flex-col p-2 rounded-lg backdrop-blur-md shadow-lg border border-white/20 transition-all ${hovered ? 'scale-110 bg-white/95' : 'scale-100 bg-white/70'}`}
          style={{ width: hovered ? '220px' : '140px' }}
        >
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 text-white rounded-full p-1"><User size={12} /></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 leading-tight">{member.name}</span>
              {hovered && (
                <div className="flex items-center text-xs text-slate-500 gap-1 mt-0.5">
                  <Code size={10} /> @{member.github}
                </div>
              )}
            </div>
          </div>
          {hovered && (
            <p className="text-[10px] text-slate-600 mt-2 font-medium leading-tight border-t border-slate-200 pt-1">
              {member.role}
            </p>
          )}
        </div>
      </Html>
    </group>
  );
}

function RegularPathFlow({ area, isVisible }) {
  const nodes = [
    { id: 'area', position: [-5, 0, 0], color: area?.color || '#cbd5e1', label: `Solicitante:\n${area?.name || 'Área'}` },
    { id: 'pm', position: [-1.5, 0, 0], color: '#f43f5e', label: 'Recepción / PM' },
    { id: 'eval', position: [2, 0, 0], color: '#eab308', label: 'Evaluación TI Manager' },
    { id: 'dev', position: [5.5, 0, 0], color: '#3b82f6', label: 'Desarrollo / DevOps' },
  ];

  const connections = [
    { start: 'area', end: 'pm', control: [-3.25, 0.5, 0] },
    { start: 'pm', end: 'eval', control: [0.25, -0.5, 0] },
    { start: 'eval', end: 'dev', control: [3.75, 0.5, 0] },
  ];

  return (
    <group visible={isVisible}>
      <Connections connections={connections} nodes={nodes} color="#94a3b8" isVisible={isVisible} />
      
      {/* Node: Area */}
      <NodeMesh position={nodes[0].position} color={nodes[0].color} label={nodes[0].label} isVisible={isVisible} hoverable={false} scale={1.2} />
      
      {/* Node: PM */}
      <NodeMesh position={nodes[1].position} color={nodes[1].color} label={nodes[1].label} isVisible={isVisible} hoverable={false} scale={1.2} />
      <Html position={[-1.5, 1.8, 0]} center zIndexRange={[100, 0]} style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }}>
        <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg shadow-lg w-56 text-center pointer-events-none">
          <div className="flex items-center justify-center gap-2 text-rose-600 mb-1 font-bold">
            <AlertTriangle size={16} /> CAMINO REGULAR
          </div>
          <p className="text-xs text-rose-800 font-medium">
            Toda solicitud externa <strong className="font-extrabold">DEBE</strong> ingresar por aquí. No se puede pedir directamente a los desarrolladores.
          </p>
        </div>
      </Html>

      {/* Node: Eval */}
      <NodeMesh position={nodes[2].position} color={nodes[2].color} label={nodes[2].label} isVisible={isVisible} hoverable={false} scale={1.2} />
      <Html position={[2, -1.8, 0]} center zIndexRange={[100, 0]} style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s' }}>
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg shadow-lg w-56 text-center pointer-events-none">
          <p className="text-xs text-amber-800 font-medium">
            TI evalúa viabilidad, costo y asigna prioridad antes de aprobar el desarrollo.
          </p>
        </div>
      </Html>

      {/* Node: Dev */}
      <NodeMesh position={nodes[3].position} color={nodes[3].color} label={nodes[3].label} isVisible={isVisible} hoverable={false} scale={1.2} />
    </group>
  );
}

export default function App() {
  const [selectedArea, setSelectedArea] = useState(null);

  return (
    <div className="w-full h-full relative bg-slate-50 flex overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-80 h-full bg-white shadow-xl z-20 flex flex-col border-r border-slate-200">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight">Directorio &<br/>Caminos Regulares</h1>
          <p className="text-xs text-slate-500 mt-2">Seleccione un área para ver sus integrantes y su flujo de interacción oficial con TI.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {companyAreas.map((area) => {
            const isSelected = selectedArea?.id === area.id;
            return (
              <div key={area.id} className="mb-2">
                <button
                  onClick={() => setSelectedArea(isSelected ? null : area)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between font-medium text-sm
                    ${isSelected ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: area.color }} />
                    {area.name}
                  </div>
                  {isSelected ? <ChevronLeft size={16} /> : <ArrowRight size={16} className="text-slate-400" />}
                </button>
                
                {/* Expandable People List */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isSelected ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                >
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mx-2 space-y-1 shadow-inner">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-1 tracking-wider">Integrantes ({area.people.length})</p>
                    {area.people.map((person, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-200/50 rounded-md transition-colors text-xs text-slate-700">
                        <User size={12} className="text-slate-400" />
                        {person}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3D CANVAS AREA */}
      <div className="flex-1 relative">
        <div className="absolute top-8 left-8 z-10 pointer-events-none">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Portal TI</h2>
          <p className="text-slate-500 mt-1">
            {selectedArea ? `Flujo de Interacción: ${selectedArea.name}` : 'Vista General de Operaciones'}
          </p>
        </div>

        {selectedArea && (
          <button 
            onClick={() => setSelectedArea(null)}
            className="absolute top-8 right-8 z-10 bg-white hover:bg-slate-100 text-slate-800 px-4 py-2 rounded-lg shadow-lg border border-slate-200 flex items-center gap-2 transition-all font-semibold animate-fade-in"
          >
            <X size={20} /> Cerrar Flujo
          </button>
        )}

        <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
          <color attach="background" args={['#f8fafc']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Environment preset="city" />

          {/* MACRO VIEW (When no area is selected) */}
          <group visible={!selectedArea}>
            <Connections connections={macroConnections} nodes={macroNodes} color="#cbd5e1" isVisible={!selectedArea} />
            {macroNodes.map((node) => (
              <NodeMesh
                key={node.id}
                position={node.position}
                color={node.color}
                label={node.label}
                isVisible={!selectedArea}
                hoverable={false}
              />
            ))}
            {teamMembers.map((member) => (
              <TeamMember key={member.id} member={member} isVisible={!selectedArea} />
            ))}
          </group>

          {/* REGULAR PATH FLOW VIEW (When area IS selected) */}
          <RegularPathFlow area={selectedArea} isVisible={!!selectedArea} />

          <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          
          <OrbitControls 
            enablePan={false} 
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 1.5}
            minDistance={8}
            maxDistance={20}
          />
        </Canvas>
      </div>
    </div>
  );
}
