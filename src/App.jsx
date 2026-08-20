import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, QuadraticBezierLine, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Server, Terminal, ShieldCheck, Rocket, ChevronLeft, Code, User, ArrowRight, X, Layers, Briefcase, Users, FileText, CheckCircle } from 'lucide-react';

// --- DATA ---
const areasData = [
  {
    id: 'negocios',
    name: 'Negocios',
    color: '#10b981',
    people: ['Euro Paz', 'Luis Lara', 'Jose Tomas Goicoechea', 'Veronica Ponce de Leon'],
    processes: [
      {
        id: 'p_venta',
        name: 'Prospección y Venta',
        nodes: [
          { id: 'n1', label: 'Prospección', details: 'Prospección multicanal (Broker, SMM, Email, Scraping, Comerciales).', roles: 'Ejecutivos Comerciales', io: 'Out: Base de Leads' },
          { id: 'n2', label: 'Calificación', details: 'Calificación de Lead y Detección de Necesidad.', roles: 'Comerciales', io: 'Out: Lead Calificado' },
          { id: 'n3', label: 'Solicitud Estimación', details: 'Solicitud formal de estimación HH/RRHH a las áreas técnicas.', roles: 'TI, Soporte', io: 'Out: Estimación de Esfuerzo' },
          { id: 'n4', label: 'Caso de Negocio', details: 'Construcción del Caso de Negocio (Servicio / Capex-Opex / Venta) con Administración.', roles: 'Administración, Negocios', io: 'Out: Business Case' },
          { id: 'n5', label: 'V°B° Gerencia', details: 'Análisis de viabilidad y V°B° de Gerencia General.', roles: 'Gerencia General', io: 'Out: Aprobación Interna' },
          { id: 'n6', label: 'Propuesta Comercial', details: 'Generación y presentación de Propuesta al cliente.', roles: 'Comerciales', io: 'Out: Propuesta formal' },
          { id: 'n7', label: 'Cierre (OC)', details: 'Aceptación del Cliente y Emisión de Orden de Compra (OC).', roles: 'Cliente, Negocios', io: 'Out: Orden de Compra' },
        ]
      }
    ]
  },
  {
    id: 'proyectos',
    name: 'Implementación / PMO',
    color: '#8b5cf6',
    people: ['Marleen Juarez', 'Roberto Vargas', 'Ricardo Lorca', 'Hector Corredor', 'Catalina Alfaro', 'Angel Muñoz'],
    processes: [
      {
        id: 'p_pmo',
        name: 'Ciclo de Proyectos',
        nodes: [
          { id: 'p1', label: 'Recepción OC', details: 'Recepción de Orden de Compra y designación de PM.', roles: 'PMO, Negocios', io: 'In: OC | Out: PM Asignado' },
          { id: 'p2', label: 'Kickoff', details: 'Kickoff multidisciplinario (Diseño, Admin, TI, Operaciones).', roles: 'PM, Equipo Completo', io: 'Out: Acta de Reunión' },
          { id: 'p3', label: 'Req. y Entregables', details: 'Elaboración de Documento de Requerimientos y Entregables.', roles: 'PM, Analista Funcional', io: 'Out: Documento BRD' },
          { id: 'p4', label: 'Traspaso a TI', details: 'Traspaso formal al ciclo de Desarrollo TI con Carta Gantt.', roles: 'PM, Líder TI', io: 'Out: Gantt, Historias de Usuario' },
          { id: 'p5', label: 'UAT y Entrega', details: 'Pruebas de Aceptación de Usuario (UAT) y Entrega Final al Cliente.', roles: 'PM, Cliente', io: 'Out: Acta de Conformidad' },
        ]
      }
    ]
  },
  {
    id: 'diseno',
    name: 'Diseño y Comunicación',
    color: '#ec4899',
    people: ['Alvaro Tejeda'],
    processes: [
      {
        id: 'p_diseno',
        name: 'Proceso Creativo UI/UX',
        nodes: [
          { id: 'c1', label: 'Recepción Necesidad', details: 'Recepción de necesidad de interfaz/marca.', roles: 'Diseñador, PM', io: 'In: Brief' },
          { id: 'c2', label: 'Investigación / AI', details: 'Investigación de usuarios y arquitectura de información.', roles: 'Diseñador UX', io: 'Out: User Journeys, Wireframes' },
          { id: 'c3', label: 'Prototipado', details: 'Prototipado en Figma / UI-UX interactivo.', roles: 'Diseñador UI', io: 'Out: Prototipo Figma' },
          { id: 'c4', label: 'Traspaso Frontend', details: 'Traspaso a Maquetación Frontend en TI.', roles: 'Diseñador, Frontend Dev', io: 'Out: Assets, Specs' },
        ]
      }
    ]
  },
  {
    id: 'soporte',
    name: 'Soporte y Continuidad (Flota)',
    color: '#06b6d4',
    people: ['Mariangly Monsalve', 'Raul Contreras', 'Carolina Levipil', 'Alexandra Morales', 'Anggie Chevez', 'Ignacia Flores', 'Amanda Vidal', 'Mariangeles Yaraure', 'Mariana Lima'],
    processes: [
      {
        id: 'p_soporte',
        name: 'Gestión de Incidencias',
        nodes: [
          { id: 's1', label: 'Monitoreo', details: 'Monitoreo en tiempo real de telemetría y sensores.', roles: 'Analistas Soporte', io: 'In: Data Telemétrica' },
          { id: 's2', label: 'Detección', details: 'Detección y clasificación de incidencias / alertas.', roles: 'Soporte L1', io: 'Out: Ticket Creado' },
          { id: 's3', label: 'Diagnóstico', details: 'Diagnóstico remoto vs despacho a patio/terreno.', roles: 'Soporte L2, Técnicos', io: 'Out: Plan de Acción' },
          { id: 's4', label: 'Plan Mitigación', details: 'Despliegue escalonado (10% flota inicial -> validación -> 100% flota).', roles: 'Soporte, DevOps', io: 'Out: Actualización / Corrección' },
          { id: 's5', label: 'Cierre', details: 'Cierre de ticket y actualización de bitácora.', roles: 'Soporte L1', io: 'Out: Ticket Cerrado, RCA' },
        ]
      }
    ]
  },
  {
    id: 'id',
    name: 'I+D',
    color: '#f97316',
    people: ['Diego Wigodski', 'Jesus Sandoval'],
    processes: [
      {
        id: 'p_id',
        name: 'Ciclo de Innovación',
        nodes: [
          { id: 'i1', label: 'Detección', details: 'Detección de oportunidad tecnológica o nuevo hardware.', roles: 'Ing. I+D', io: 'In: Tendencias de Mercado' },
          { id: 'i2', label: 'Prototipado (POC)', details: 'Prototipado rápido y pruebas de concepto (POC).', roles: 'Ing. I+D, Devs', io: 'Out: POC Funcional' },
          { id: 'i3', label: 'Validación', details: 'Validación de viabilidad con TI y Negocios.', roles: 'TI, Negocios, I+D', io: 'Out: Informe Viabilidad' },
          { id: 'i4', label: 'Productización', details: 'Traspaso a ingeniería para desarrollo final a escala.', roles: 'Equipo TI Core', io: 'Out: Specs Técnicas' },
        ]
      }
    ]
  },
  {
    id: 'admin',
    name: 'Administración & Finanzas',
    color: '#f59e0b',
    people: ['Alejandro Gonzalez', 'Pablo Amarista', 'Alba Rodriguez', 'Lixandro Albarran', 'Gonzalo Tejeda', 'Andrea Cisterna', 'Randy Amaya', 'Maria Isabel Carrasco', 'Milibeth Garcia'],
    processes: [
      {
        id: 'p_finanzas',
        name: 'Gestión Financiera',
        nodes: [
          { id: 'a1', label: 'Valorización', details: 'Valorización de costos y cotizaciones de proveedores/hardware.', roles: 'Analista Finanzas', io: 'In: Requerimientos | Out: Presupuesto' },
          { id: 'a2', label: 'Control Ppto', details: 'Control presupuestario y emisión de contratos.', roles: 'Legal, Admin', io: 'Out: Contratos, Presupuesto Aprobado' },
          { id: 'a3', label: 'Facturación', details: 'Facturación por hitos cumplidos según avance de proyectos.', roles: 'Facturación, PMO', io: 'Out: Facturas Emitidas' },
        ]
      }
    ]
  },
  {
    id: 'ti',
    name: 'TI (Ingeniería)',
    color: '#3b82f6',
    people: ['Ivan Valenzuela', 'Dorian Gonzalez', 'Luis Mendez', 'Rodrigo Valdebenito', 'Alejandro Ville', 'Luis Sanchez', 'Dominique Meza', 'Julyt Uribes', 'Ayelem Erices'],
    processes: [
      {
        id: 'p_ti_dev',
        name: 'Desarrollo Core',
        nodes: [
          { id: 't1', label: 'Sprint Dev', details: 'Planificación de Sprint y codificación (Backend/Frontend).', roles: 'Devs, Scrum Master', io: 'In: Backlog | Out: Código' },
          { id: 't2', label: 'QA Testing', details: 'Pruebas automatizadas y manuales de calidad.', roles: 'QA Engineer', io: 'Out: Reporte QA' },
          { id: 't3', label: 'Deploy', details: 'Despliegue a Producción (CI/CD).', roles: 'DevOps', io: 'Out: Feature en Producción' },
        ]
      },
      {
        id: 'p_ti_cambio',
        name: 'Solicitud Cambio / Hotfix',
        nodes: [
          { id: 'th1', label: 'Recepción RFC', details: 'Ingreso de Request For Change o Hotfix urgente.', roles: 'PM, Soporte', io: 'In: RFC' },
          { id: 'th2', label: 'War Room (si aplica)', details: 'Gestión de incidente severo en equipo (War Room).', roles: 'Infra, Dev Core', io: 'Out: Solución Rápida' },
          { id: 'th3', label: 'Deploy & RCA', details: 'Despliegue del Hotfix y elaboración de Root Cause Analysis.', roles: 'DevOps, Arquitectura', io: 'Out: RCA, Parche Prod' },
        ]
      },
      {
        id: 'p_ti_bi',
        name: 'Business Intelligence',
        nodes: [
          { id: 'b1', label: 'Extracción (ETL)', details: 'Extracción, Transformación y Carga de datos crudos.', roles: 'Data Engineer', io: 'In: BDs Crudas' },
          { id: 'b2', label: 'Data Marts', details: 'Estructuración en modelos dimensionales analíticos.', roles: 'Data Architect', io: 'Out: Data Marts' },
          { id: 'b3', label: 'Dashboards', details: 'Construcción y publicación de tableros de BI.', roles: 'Data Analyst', io: 'Out: Dashboard' },
        ]
      }
    ]
  },
];

const teamOrbiters = [
  { id: 't1', name: 'Dorian Gonzalez', github: 'dorian-cesar', role: 'Lidera arquitectura y aprueba pases a Prod.', targetNode: 'ti', orbitRadius: 2.5, speed: 0.5, yOffset: 1, color: '#10b981' },
  { id: 't2', name: 'Diego Wigodski', github: 'diegowigo', role: 'I+D y Nuevas Herramientas', targetNode: 'id', orbitRadius: 2.2, speed: 0.4, yOffset: -1.5, color: '#f59e0b' },
  { id: 't3', name: 'Diego Farias', github: 'D1Farias', role: 'Integración y Despliegue', targetNode: 'ti', orbitRadius: 2.7, speed: 0.6, yOffset: 0.5, color: '#3b82f6' },
  { id: 't4', name: 'Luis Sanchez', github: 'HLCXPL', role: 'Infraestructura', targetNode: 'ti', orbitRadius: 2.3, speed: 0.45, yOffset: -0.5, color: '#8b5cf6' },
];

const macroNodes = [
  { id: 'negocios', label: 'Negocios', position: [-4, 3, 0], color: '#10b981' },
  { id: 'proyectos', label: 'Implementación', position: [0, 3, 0], color: '#8b5cf6' },
  { id: 'diseno', label: 'Diseño', position: [4, 3, 0], color: '#ec4899' },
  { id: 'soporte', label: 'Soporte', position: [-4, 0, 0], color: '#06b6d4' },
  { id: 'id', label: 'I+D', position: [0, 0, 0], color: '#f97316' },
  { id: 'admin', label: 'Admin & Finanzas', position: [4, 0, 0], color: '#f59e0b' },
  { id: 'ti', label: 'TI Core', position: [0, -3, 0], color: '#3b82f6' },
];

// Draw some general macro connections
const macroConnections = [
  { start: 'negocios', end: 'proyectos', control: [-2, 3.5, 0] },
  { start: 'proyectos', end: 'ti', control: [2, 0, -1] },
  { start: 'id', end: 'ti', control: [1, -1.5, 1] },
  { start: 'soporte', end: 'ti', control: [-2, -1.5, 0] },
  { start: 'diseno', end: 'ti', control: [2, -1.5, 0] },
  { start: 'admin', end: 'proyectos', control: [2, 1.5, 0] },
];

// --- COMPONENTS ---
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

function ProcessFlow({ process, color, isVisible, activeNodeId, setActiveNodeId }) {
  if (!process) return null;
  
  const nodes = process.nodes.map((n, i) => {
    // Layout in a straight line or slight curve
    const xPos = (i - process.nodes.length / 2) * 2.5 + 1.25;
    return {
      ...n,
      position: [xPos, 0, 0],
      color: color
    };
  });

  const connections = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    connections.push({
      start: nodes[i].id,
      end: nodes[i+1].id,
      control: [(nodes[i].position[0] + nodes[i+1].position[0]) / 2, 1, 0]
    });
  }

  return (
    <group visible={isVisible}>
      <Connections connections={connections} nodes={nodes} color="#94a3b8" isVisible={isVisible} />
      
      {nodes.map((n) => {
        const isActive = activeNodeId === n.id;
        return (
          <group key={n.id}>
            <NodeMesh 
              position={n.position} 
              color={isActive ? '#f59e0b' : n.color} 
              label={n.label} 
              isVisible={isVisible} 
              hoverable={true} 
              scale={isActive ? 1.3 : 1}
              onClick={() => setActiveNodeId(isActive ? null : n.id)}
            />
            {isActive && isVisible && (
              <Html position={[n.position[0], n.position[1] + 1.5, n.position[2]]} center zIndexRange={[100, 0]}>
                <div className="bg-white/95 backdrop-blur-sm border border-slate-200 p-4 rounded-xl shadow-xl w-64 animate-fade-in pointer-events-auto">
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
                    <CheckCircle size={16} style={{ color: n.color }} />
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{n.label}</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{n.details}</p>
                  
                  <div className="bg-slate-50 p-2 rounded text-xs space-y-1">
                    <div className="flex items-start gap-1.5">
                      <Users size={12} className="text-slate-400 mt-0.5" />
                      <span className="text-slate-700"><strong>Rol:</strong> {n.roles}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <FileText size={12} className="text-slate-400 mt-0.5" />
                      <span className="text-slate-700"><strong>IO:</strong> {n.io}</span>
                    </div>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}

export default function App() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [activeProcessIdx, setActiveProcessIdx] = useState(0);
  const [activeNodeId, setActiveNodeId] = useState(null);

  const handleAreaSelect = (area) => {
    setSelectedArea(selectedArea?.id === area.id ? null : area);
    setActiveProcessIdx(0);
    setActiveNodeId(null);
  };

  const currentProcess = selectedArea?.processes[activeProcessIdx];

  return (
    <div className="w-full h-full relative bg-slate-50 flex overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-80 h-full bg-white shadow-2xl z-20 flex flex-col border-r border-slate-200">
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 backdrop-blur">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">Mapeo de Procesos Core</h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">Seleccione un área para explorar su flujo de trabajo completo.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {areasData.map((area) => {
            const isSelected = selectedArea?.id === area.id;
            return (
              <div key={area.id} className="mb-2">
                <button
                  onClick={() => handleAreaSelect(area)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between font-bold text-sm border
                    ${isSelected ? 'bg-slate-800 text-white shadow-lg border-transparent' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: area.color }} />
                    {area.name}
                  </div>
                  {isSelected ? <ChevronLeft size={16} className="text-slate-400" /> : <ArrowRight size={16} className="text-slate-300" />}
                </button>
                
                {/* Expandable People List */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isSelected ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                >
                  <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 mx-2 shadow-inner">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-1 tracking-widest flex items-center gap-1">
                      <Users size={10} /> Integrantes del Equipo
                    </p>
                    <div className="space-y-0.5">
                      {area.people.map((person, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-2 py-1.5 hover:bg-white rounded-md transition-colors text-xs font-medium text-slate-600 shadow-sm border border-transparent hover:border-slate-100">
                          <User size={12} className="text-slate-400" />
                          {person}
                        </div>
                      ))}
                    </div>
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
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">Portal Corporativo 3D</h2>
          <p className="text-slate-600 mt-1 font-medium bg-white/50 backdrop-blur px-3 py-1 rounded-full inline-block border border-white/50">
            {selectedArea ? `${selectedArea.name} > ${currentProcess?.name}` : 'Vista Global de Operaciones'}
          </p>
        </div>

        {/* Process Tabs */}
        {selectedArea && selectedArea.processes.length > 1 && (
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex gap-2 bg-white/80 backdrop-blur p-2 rounded-xl shadow-md border border-slate-200">
            {selectedArea.processes.map((proc, idx) => (
              <button
                key={proc.id}
                onClick={() => { setActiveProcessIdx(idx); setActiveNodeId(null); }}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeProcessIdx === idx ? 'bg-slate-800 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {proc.name}
              </button>
            ))}
          </div>
        )}

        {selectedArea && (
          <button 
            onClick={() => handleAreaSelect(selectedArea)} // toggle off
            className="absolute top-8 right-8 z-10 bg-white hover:bg-slate-50 text-slate-800 px-4 py-2 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2 transition-all font-bold animate-fade-in"
          >
            <X size={18} /> Cerrar Flujo
          </button>
        )}

        {/* INSTRUCTIONS OVERLAY */}
        {selectedArea && (
           <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl border border-slate-200 animate-fade-in text-center">
             <p className="text-sm text-slate-800 font-bold">
               🖱️ Haga clic en los nodos esféricos para ver los detalles del paso.
             </p>
           </div>
        )}

        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <color attach="background" args={['#f8fafc']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Environment preset="city" />

          {/* MACRO VIEW */}
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
            {teamOrbiters.map((member) => (
              <TeamMember key={member.id} member={member} isVisible={!selectedArea} />
            ))}
          </group>

          {/* MICRO / PROCESS FLOW VIEW */}
          {selectedArea && (
            <ProcessFlow 
              process={currentProcess} 
              color={selectedArea.color} 
              isVisible={!!selectedArea}
              activeNodeId={activeNodeId}
              setActiveNodeId={setActiveNodeId} 
            />
          )}

          <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={30} blur={2.5} far={4.5} color="#94a3b8" />
          
          <OrbitControls 
            enablePan={true}
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 1.5}
            minDistance={8}
            maxDistance={25}
          />
        </Canvas>
      </div>
    </div>
  );
}
