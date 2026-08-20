import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, QuadraticBezierLine, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Server, Terminal, ShieldCheck, Rocket, ChevronLeft, Code, User, ArrowRight, X, Layers, Briefcase, Users, FileText, CheckCircle, Mail, Phone, MapPin, Crown, Award, Star, Shield, Sparkles } from 'lucide-react';

// --- DATA ---
const allCollaborators = [
  // Negocios
  { id: 'c_epaz', name: 'Euro Jose Paz Añez', initials: 'EP', area: 'proyectos', role: 'Gerente de PMO / Implementación', rank: 'gerente', email: 'epaz@wit.la', phone: '+56947518114', location: 'Casa Matriz', github: null },
  { id: 'c_llara', name: 'Luis Eduardo Lara Villarroel', initials: 'LL', area: 'negocios', role: 'Desarrollo & Estrategia', rank: 'standard', email: 'llara@wit.la', phone: '+56948104842', location: 'Casa Matriz', github: null },
  { id: 'c_jtgoicoechea', name: 'José Tomás Goicoechea Nervi', initials: 'JG', area: 'negocios', role: 'Gerente de Negocios', rank: 'gerente', email: 'Jgoicoechea@wit.la', phone: '+56977953840', location: 'Casa Matriz', github: null },
  { id: 'c_vponce', name: 'Verónica Ponce de León', initials: 'VP', area: 'negocios', role: 'Desarrollo & Estrategia', rank: 'standard', email: 'vponcedeleon@wit.la', phone: '+56961662249', location: 'Casa Matriz', github: null },

  // Admin & Finanzas
  { id: 'c_agonzalez', name: 'Alejandro Gonzalez Espinosa', initials: 'AG', area: 'admin', role: 'Gerente General / CEO', rank: 'ceo', email: 'alejandrogonzalez@wit.la', phone: '+56942230775', location: 'Estación Central', github: null },
  { id: 'c_gtejeda', name: 'Jose Gonzalo Fuentes Tejeda', initials: 'GT', area: 'admin', role: 'Administración', rank: 'standard', email: 'gonzalotejeda@wit.la', phone: '+56990333346', location: 'Casa Matriz', github: null },
  { id: 'c_pamarista', name: 'Pablo Efrain José Amarista', initials: 'PA', area: 'admin', role: 'Producción y Manufactura', rank: 'standard', email: 'pamarista@wit.la', phone: '+56963286119', location: 'Casa Matriz', github: null },
  { id: 'c_arodriguez', name: 'Alba Yulitza Rodríguez', initials: 'AR', area: 'admin', role: 'Gerente de Recursos Humanos', rank: 'gerente', email: 'alba.rodriguez@wit.la', phone: '+56947521147', location: 'Casa Matriz', github: null },
  { id: 'c_lalbarran', name: 'Lixandro Jose Albarran', initials: 'LA', area: 'admin', role: 'Gerente de Administración', rank: 'gerente', email: 'lalbarran@wit.la', phone: '+56977298122', location: 'Casa Matriz', github: null },
  { id: 'c_acisterna', name: 'Andrea Cisterna', initials: 'AC', area: 'admin', role: 'Servicios Generales', rank: 'standard', email: 'andreacisternas7287@gmail.com', phone: '+5691387484', location: 'Casa Matriz', github: null },
  { id: 'c_ramaya', name: 'Randy Miguel Amaya', initials: 'RA', area: 'admin', role: 'Administración Gráfica', rank: 'standard', email: 'Grafica@pullman.cl', phone: '+56963230570', location: 'Casa Matriz', github: null },
  { id: 'c_mcarrasco', name: 'María Isabel Carrasco', initials: 'MC', area: 'admin', role: 'Administración & Gestión', rank: 'standard', email: 'mcarrasco@wit.la', phone: '+56920010716', location: 'Casa Matriz', github: null },
  { id: 'c_mgarcia', name: 'Milibeth García Jordan', initials: 'MG', area: 'admin', role: 'Administración & Gestión', rank: 'standard', email: 'milibethjordan@gmail.com', phone: '+56956367426', location: 'San Borja', github: null },

  // Implementación / Proyectos
  { id: 'c_mjuarez', name: 'Marleen Marielena Juarez', initials: 'MJ', area: 'proyectos', role: 'Implementación & Op', rank: 'standard', email: 'mjuarez@wit.la', phone: '+56996981505', location: 'Casa Matriz', github: null },
  { id: 'c_rvargas', name: 'Roberto Gustavo Vargas', initials: 'RV', area: 'proyectos', role: 'Implementación & Op', rank: 'standard', email: 'rvargas@sertran.cl', phone: '+56987860962', location: 'Casa Matriz', github: null },
  { id: 'c_rlorca', name: 'Ricardo Andrés Lorca', initials: 'RL', area: 'proyectos', role: 'Implementación', rank: 'standard', email: 'rlorca@wit.la', phone: '+56927217418', location: 'Casa Matriz', github: null },
  { id: 'c_hcorredor', name: 'Héctor José Corredor', initials: 'HC', area: 'proyectos', role: 'Implementación', rank: 'standard', email: 'hejocome2018@gmail.com', phone: '+56979592369', location: 'Casa Matriz', github: null },
  { id: 'c_calfaro', name: 'Catalina Antonia Alfaro', initials: 'CA', area: 'proyectos', role: 'Implementación', rank: 'standard', email: 'cat.alfarot@gmail.com', phone: '+56982721892', location: 'Casa Matriz', github: null },
  { id: 'c_amunoz', name: 'Angel Segundo Muñoz', initials: 'AM', area: 'proyectos', role: 'Soporte en Terreno', rank: 'standard', email: 'Chicho06as@gmail.com', phone: '+56967315323', location: 'Terreno', github: null },

  // Diseño
  { id: 'c_aville', name: 'Alejandro Alvaro Villé', initials: 'AV', area: 'diseno', role: 'Gerente de Diseño', rank: 'gerente', email: 'aville@wit.la', phone: '+56932917135', location: 'Casa Matriz', github: null },
  { id: 'c_atejeda', name: 'Alvaro Daniel Tejeda', initials: 'AT', area: 'diseno', role: 'Diseño y Comunicación', rank: 'standard', email: 'tejedareyes@gmail.com', phone: '+56977107308', location: 'Casa Matriz', github: null },
  { id: 'c_juribes', name: 'Julyt Ajelet Sahar Uribes', initials: 'JU', area: 'diseno', role: 'Diseño UI/UX', rank: 'standard', email: 'juribes@wit.la', phone: '+56935143479', location: 'Casa Matriz', github: null },
  { id: 'c_dmeza', name: 'Dominique Melissa Meza', initials: 'DM', area: 'diseno', role: 'Diseño Frontend / UI', rank: 'standard', email: 'Domi.meza@duocuc.cl', phone: '+56945884822', location: 'San Borja', github: null },
  { id: 'c_aerices', name: 'Ayelem Antonella Erices', initials: 'AE', area: 'diseno', role: 'Diseño Gráfico / UI', rank: 'standard', email: 'Ericesayelem71@gmail.com', phone: '+56941739810', location: 'San Borja', github: null },

  // I+D
  { id: 'c_jsandoval', name: 'Jesus Orlando Sandoval', initials: 'JS', area: 'id', role: 'Investigación & Desarrollo', rank: 'standard', email: 'sandoval.jesus2005@gmail.com', phone: '+56981226760', location: 'Casa Matriz', github: null },

  // Soporte
  { id: 'c_mmonsalve', name: 'Mariangly Monsalve Luque', initials: 'MM', area: 'soporte', role: 'Soporte y Pos Venta', rank: 'standard', email: 'soporte@wit.la', phone: '+56990737619', location: 'Casa Matriz', github: null },
  { id: 'c_rcontreras', name: 'Raul Eduardo Contreras', initials: 'RC', area: 'soporte', role: 'Jefe Soporte', rank: 'lead', email: 'reca07@gmail.com', phone: '+56967281675', location: 'San Borja', github: null },
  { id: 'c_clevipil', name: 'Carolina Andrea Levipil', initials: 'CL', area: 'soporte', role: 'Atención a Clientes', rank: 'standard', email: 'karolina.levipil@icloud.com', phone: '+56978194180', location: 'San Borja', github: null },
  { id: 'c_amorales', name: 'Alexandra Nicole Morales', initials: 'AM', area: 'soporte', role: 'Soporte y Pos Venta', rank: 'standard', email: 'Workale70@gmail.com', phone: '+56930200221', location: 'San Borja', github: null },
  { id: 'c_achevez', name: 'Anggie Katiusca Chevez', initials: 'AC', area: 'soporte', role: 'Soporte y Atención', rank: 'standard', email: 'angiedaniel2809@gmail.com', phone: '+56979352096', location: 'San Borja', github: null },
  { id: 'c_iflores', name: 'Ignacia Anabel Flores', initials: 'IF', area: 'soporte', role: 'Soporte y Pos Venta', rank: 'standard', email: 'ignaciaflores2001@gmail.com', phone: '+56963101152', location: 'San Borja', github: null },
  { id: 'c_avidal', name: 'Amanda Ignacia Vidal', initials: 'AV', area: 'soporte', role: 'Soporte y Atención', rank: 'standard', email: 'mandiv322@gmail.com', phone: '+56945526476', location: 'San Borja', github: null },
  { id: 'c_myaraure', name: 'Mariangeles Jesús Yaraure', initials: 'MY', area: 'soporte', role: 'Atención al Cliente', rank: 'standard', email: 'myaraure@wit.la', phone: '+56993798851', location: 'Casa Matriz', github: null },
  { id: 'c_mlima', name: 'Mariana Lima Santander', initials: 'ML', area: 'soporte', role: 'Atención al Cliente', rank: 'standard', email: 'mlima@wit.la', phone: '+56964111962', location: 'Casa Matriz', github: null },

  // TI (Core)
  { id: 'c_ivalenzuela', name: 'Iván Andrés Valenzuela', initials: 'IV', area: 'ti', role: 'Gerente de Tecnología', rank: 'gerente', email: 'ivalenzuela@wit.la', phone: '+56942858102', location: 'Casa Matriz', github: 'ivan-valenzuela' },
  { id: 'c_dgonzalez', name: 'Dorian Cesar Gonzalez', initials: 'DG', area: 'ti', role: 'Jefe Tecnología / Arquitectura', rank: 'lead', email: 'dgonzalez@wit.la', phone: '+56950906625', location: 'Casa Matriz', github: 'dorian-cesar' },
  { id: 'c_dwigodski', name: 'Diego Wigodski Carafí', initials: 'DW', area: 'ti', role: 'Investigación & Desarrollo', rank: 'lead', email: 'dwigodski@wit.la', phone: '+56981914052', location: 'Casa Matriz', github: 'diegowigo' },
  { id: 'c_dfarias', name: 'Diego Farias', initials: 'DF', area: 'ti', role: 'Ingeniero DevOps & CI/CD', rank: 'lead', email: 'dfarias@wit.la', phone: '+56988888888', location: 'Casa Matriz', github: 'D1Farias' },
  { id: 'c_lsanchez', name: 'Luis Omar Sanchez Diaz', initials: 'LS', area: 'ti', role: 'Desarrollo Backend & Infraestructura', rank: 'lead', email: 'hlcxpl@gmail.com', phone: '+56986683369', location: 'San Borja', github: 'HLCXPL' },
  { id: 'c_lmendez', name: 'Luis Aroldo Mendez', initials: 'LM', area: 'ti', role: 'Tecnología & Redes', rank: 'standard', email: 'lmendez@sertran.cl', phone: '+56982300640', location: 'Casa Matriz', github: null },
  { id: 'c_rvaldebenito', name: 'Rodrigo Alejandro Valdebenito', initials: 'RV', area: 'ti', role: 'Tecnología & Sistemas', rank: 'standard', email: 'rvalde@pullman.cl', phone: '+56984645310', location: 'Casa Matriz', github: null },
];

const areasData = [
  {
    id: 'negocios',
    name: 'Negocios',
    color: '#10b981',
    position: [-4, 3, 0],
    processes: [
      {
        id: 'p_venta',
        name: 'Prospección y Venta',
        nodes: [
          { id: 'n1', label: 'Prospección', details: 'Prospección multicanal.', roles: 'Comerciales', io: 'Out: Leads' },
          { id: 'n2', label: 'Calificación', details: 'Detección de Necesidad.', roles: 'Comerciales', io: 'Out: Lead Calificado' },
          { id: 'n3', label: 'Estimación TI', details: 'Solicitud formal HH a TI.', roles: 'TI, Soporte', io: 'Out: Estimación' },
          { id: 'n4', label: 'Caso Negocio', details: 'Construcción con Admin.', roles: 'Admin, Negocios', io: 'Out: Business Case' },
          { id: 'n5', label: 'Aprobación', details: 'V°B° de Gerencia.', roles: 'Gerencia General', io: 'Out: Aprobación' },
          { id: 'n6', label: 'Propuesta', details: 'Presentación al cliente.', roles: 'Comerciales', io: 'Out: Propuesta' },
          { id: 'n7', label: 'Cierre OC', details: 'Emisión de OC.', roles: 'Cliente, Negocios', io: 'Out: OC' },
        ]
      }
    ]
  },
  {
    id: 'proyectos',
    name: 'PMO / Implementación',
    color: '#8b5cf6',
    position: [0, 3, 0],
    processes: [
      {
        id: 'p_pmo',
        name: 'Ciclo de Proyectos',
        nodes: [
          { id: 'p1', label: 'Recepción OC', details: 'Recepción y designación PM.', roles: 'PMO', io: 'In: OC' },
          { id: 'p2', label: 'Kickoff', details: 'Kickoff multidisciplinario.', roles: 'Equipo Completo', io: 'Out: Acta' },
          { id: 'p3', label: 'BRD', details: 'Requerimientos y Entregables.', roles: 'PM', io: 'Out: BRD' },
          { id: 'p4', label: 'Traspaso TI', details: 'Traspaso a Desarrollo TI.', roles: 'PM, TI', io: 'Out: Gantt' },
          { id: 'p5', label: 'Entrega', details: 'UAT y Entrega Final.', roles: 'PM, Cliente', io: 'Out: Conformidad' },
        ]
      }
    ]
  },
  {
    id: 'diseno',
    name: 'Diseño',
    color: '#ec4899',
    position: [4, 3, 0],
    processes: [
      {
        id: 'p_diseno',
        name: 'Proceso Creativo',
        nodes: [
          { id: 'c1', label: 'Recepción', details: 'Recepción de necesidad.', roles: 'Diseñador', io: 'In: Brief' },
          { id: 'c2', label: 'UX/AI', details: 'Investigación de usuarios.', roles: 'Diseñador UX', io: 'Out: Wireframes' },
          { id: 'c3', label: 'Prototipado', details: 'Prototipado en Figma.', roles: 'Diseñador UI', io: 'Out: Figma' },
          { id: 'c4', label: 'Frontend', details: 'Maquetación Frontend.', roles: 'Frontend Dev', io: 'Out: Assets' },
        ]
      }
    ]
  },
  {
    id: 'soporte',
    name: 'Soporte',
    color: '#06b6d4',
    position: [-4, 0, 0],
    processes: [
      {
        id: 'p_soporte',
        name: 'Gestión de Incidencias',
        nodes: [
          { id: 's1', label: 'Monitoreo', details: 'Monitoreo de telemetría.', roles: 'Soporte', io: 'In: Data' },
          { id: 's2', label: 'Detección', details: 'Clasificación de alertas.', roles: 'Soporte L1', io: 'Out: Ticket' },
          { id: 's3', label: 'Diagnóstico', details: 'Diagnóstico remoto.', roles: 'Soporte L2', io: 'Out: Acción' },
          { id: 's4', label: 'Mitigación', details: 'Despliegue escalonado.', roles: 'Soporte, DevOps', io: 'Out: Parche' },
          { id: 's5', label: 'Cierre', details: 'Cierre de ticket.', roles: 'Soporte L1', io: 'Out: Ticket Cerrado' },
        ]
      }
    ]
  },
  {
    id: 'id',
    name: 'I+D',
    color: '#f97316',
    position: [0, 0, 0],
    processes: [
      {
        id: 'p_id',
        name: 'Ciclo de Innovación',
        nodes: [
          { id: 'i1', label: 'Oportunidad', details: 'Detección de oportunidad.', roles: 'I+D', io: 'In: Mercado' },
          { id: 'i2', label: 'POC', details: 'Prototipado rápido.', roles: 'I+D, Devs', io: 'Out: POC' },
          { id: 'i3', label: 'Viabilidad', details: 'Validación técnica/negocio.', roles: 'TI, Negocios', io: 'Out: Informe' },
          { id: 'i4', label: 'Producción', details: 'Desarrollo a escala.', roles: 'TI Core', io: 'Out: Specs' },
        ]
      }
    ]
  },
  {
    id: 'admin',
    name: 'Administración',
    color: '#f59e0b',
    position: [4, 0, 0],
    processes: [
      {
        id: 'p_finanzas',
        name: 'Gestión Financiera',
        nodes: [
          { id: 'a1', label: 'Valorización', details: 'Cotizaciones de costos.', roles: 'Finanzas', io: 'Out: Presupuesto' },
          { id: 'a2', label: 'Control Ppto', details: 'Contratos y control.', roles: 'Legal, Admin', io: 'Out: Contrato' },
          { id: 'a3', label: 'Facturación', details: 'Facturación por hitos.', roles: 'Facturación', io: 'Out: Facturas' },
        ]
      }
    ]
  },
  {
    id: 'ti',
    name: 'TI Core',
    color: '#3b82f6',
    position: [0, -3, 0],
    processes: [
      {
        id: 'p_ti_dev',
        name: 'Desarrollo Core',
        nodes: [
          { id: 't1', label: 'Sprint Dev', details: 'Planificación y código.', roles: 'Devs', io: 'Out: Código' },
          { id: 't2', label: 'QA Testing', details: 'Pruebas automatizadas.', roles: 'QA', io: 'Out: QA Report' },
          { id: 't3', label: 'Deploy', details: 'Despliegue a Prod.', roles: 'DevOps', io: 'Out: Release' },
        ]
      },
      {
        id: 'p_ti_cambio',
        name: 'Solicitud Cambio / Hotfix',
        nodes: [
          { id: 'th1', label: 'RFC', details: 'Ingreso Request Change.', roles: 'PM', io: 'In: RFC' },
          { id: 'th2', label: 'War Room', details: 'Gestión de incidente.', roles: 'Infra, Dev', io: 'Out: Hotfix' },
          { id: 'th3', label: 'RCA', details: 'Despliegue y RCA.', roles: 'DevOps', io: 'Out: RCA' },
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

// Combine all collaborators into teamOrbiters with calculated orbits
const teamOrbiters = allCollaborators.map((c) => {
  const targetArea = areasData.find(a => a.id === c.area);
  const areaCollaborators = allCollaborators.filter(col => col.area === c.area);
  const idx = areaCollaborators.findIndex(col => col.id === c.id);
  const total = areaCollaborators.length;
  
  const initialAngle = (idx / total) * Math.PI * 2;
  const radius = c.rank === 'ceo' ? 0.8 : (c.rank === 'gerente' ? 1.5 : (1.8 + (idx % 4) * 0.45));
  const speed = c.rank === 'ceo' ? 0.05 : (c.rank === 'gerente' ? 0.1 : (0.15 + (idx % 3) * 0.1));
  const yOffset = c.rank === 'ceo' ? 2 : (c.rank === 'gerente' ? 1.5 : Math.sin((idx / total) * Math.PI * 2) * 1.5);

  return {
    ...c,
    targetNode: c.area,
    color: targetArea?.color || '#cbd5e1',
    initialAngle,
    orbitRadius: radius,
    speed,
    yOffset
  };
});

const macroConnections = [
  { start: 'negocios', end: 'proyectos', control: [-2, 3.5, 0] },
  { start: 'proyectos', end: 'ti', control: [2, 0, -1] },
  { start: 'id', end: 'ti', control: [1, -1.5, 1] },
  { start: 'soporte', end: 'ti', control: [-2, -1.5, 0] },
  { start: 'diseno', end: 'ti', control: [2, -1.5, 0] },
  { start: 'admin', end: 'proyectos', control: [2, 1.5, 0] },
];

// --- STYLED GLOBALS ---
const injectStyles = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById('badge-styles')) return;
  const style = document.createElement('style');
  style.id = 'badge-styles';
  style.innerHTML = `
    @keyframes pulse-halo {
      0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); transform: scale(1); }
      70% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); transform: scale(1.05); }
      100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); transform: scale(1); }
    }
    @keyframes glow-border {
      0% { border-color: rgba(148, 163, 184, 0.5); box-shadow: 0 0 5px rgba(148, 163, 184, 0.2); }
      50% { border-color: rgba(148, 163, 184, 1); box-shadow: 0 0 15px rgba(148, 163, 184, 0.8); }
      100% { border-color: rgba(148, 163, 184, 0.5); box-shadow: 0 0 5px rgba(148, 163, 184, 0.2); }
    }
    .badge-ceo {
      background: #020617;
      color: #fbbf24;
      border: 2px solid #fbbf24;
      animation: pulse-halo 2s infinite;
      transform: scale(1.4);
    }
    .badge-gerente {
      background: #0f172a;
      color: #f1f5f9;
      border: 2px solid #cbd5e1;
      animation: glow-border 3s infinite;
      transform: scale(1.2);
    }
    .badge-lead {
      background: #1e293b;
      color: #38bdf8;
      border: 1px solid #38bdf8;
      transform: scale(1.1);
    }
  `;
  document.head.appendChild(style);
};

// --- COMPONENTS ---
function TeamMember({ member, isVisible }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const target = areasData.find(n => n.id === member.targetNode);

  useEffect(() => {
    injectStyles();
  }, []);

  useFrame((state) => {
    if (!isVisible) return;
    if (meshRef.current && target) {
      const time = (state.clock.elapsedTime * member.speed) + member.initialAngle;
      const x = target.position[0] + Math.cos(time) * member.orbitRadius;
      const z = target.position[2] + Math.sin(time) * member.orbitRadius;
      const floatAmp = member.rank === 'ceo' ? 0.3 : (member.rank === 'gerente' ? 0.2 : 0.2);
      const y = target.position[1] + member.yOffset + Math.sin(state.clock.elapsedTime * 1.5 + member.initialAngle) * floatAmp;
      
      meshRef.current.position.lerp(new THREE.Vector3(x, y, z), 0.1);
      meshRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  if (!isVisible && !meshRef.current) return null;

  let badgeClass = 'text-slate-700 bg-white/95 border border-slate-300';
  let BadgeIcon = null;

  if (member.rank === 'ceo') {
    badgeClass = 'badge-ceo shadow-amber-500/50';
    BadgeIcon = <Crown size={12} className="absolute -top-3 -right-2 text-amber-500 drop-shadow-md z-10 animate-bounce" />;
  } else if (member.rank === 'gerente') {
    badgeClass = 'badge-gerente shadow-slate-300/50';
    BadgeIcon = <Award size={10} className="absolute -top-2 -right-1 text-slate-300 drop-shadow-sm z-10" />;
  } else if (member.rank === 'lead') {
    badgeClass = 'badge-lead shadow-sky-500/30';
    BadgeIcon = <Terminal size={10} className="absolute -top-2 -right-1 text-sky-400 z-10" />;
  }

  const customBadgeStyle = {};
  if (member.rank === 'standard') {
    customBadgeStyle.borderColor = member.color;
    customBadgeStyle.color = member.color; // text in area color
    if (hovered) {
      customBadgeStyle.backgroundColor = member.color;
      customBadgeStyle.color = '#fff';
    } else {
      customBadgeStyle.backgroundColor = '#f8fafc'; // slate-50
    }
  }

  return (
    <group ref={meshRef}>
      <Html position={[0, 0, 0]} center style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: isVisible ? 'auto' : 'none', zIndex: hovered ? 100 : 1 }}>
        <div 
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`relative group cursor-pointer flex items-center justify-center`}
        >
          {/* Avatar Badge Container */}
          <div className="relative">
            {BadgeIcon}
            <div 
              className={`w-7 h-7 rounded-full shadow-md flex items-center justify-center font-extrabold text-[10px] transition-all duration-300 
                ${badgeClass} ${hovered && member.rank === 'standard' ? 'scale-125 shadow-xl' : 'hover:scale-110'}`}
              style={customBadgeStyle}
            >
              {member.initials}
            </div>
            
            {member.rank === 'ceo' && !hovered && (
               <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 text-[8px] font-black px-1.5 py-0.5 rounded shadow whitespace-nowrap border border-amber-300">
                 CEO
               </div>
            )}
            {member.rank === 'gerente' && !hovered && (
               <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-slate-100 text-[8px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap border border-slate-500">
                 GERENTE
               </div>
            )}
          </div>

          {/* Expanded Modal */}
          {hovered && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-2xl p-4 animate-fade-in pointer-events-none">
              <div className="flex items-start gap-3 border-b border-slate-100 pb-3 mb-3 relative">
                
                {member.rank === 'ceo' && <Sparkles size={24} className="absolute top-0 right-0 text-amber-400 opacity-20" />}
                
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 shadow-inner
                    ${member.rank === 'ceo' ? 'badge-ceo' : member.rank === 'gerente' ? 'badge-gerente' : member.rank === 'lead' ? 'badge-lead' : 'text-white'}`} 
                  style={member.rank === 'standard' ? { backgroundColor: member.color } : {}}
                >
                  {member.initials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight flex items-center gap-1">
                    {member.name} 
                    {member.rank === 'ceo' && <Crown size={12} className="text-amber-500" />}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1" style={{ color: member.color }}>
                    {member.role}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-slate-400" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-slate-400" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-slate-400" />
                  <span>{member.location}</span>
                </div>
                {member.github && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                    <Code size={12} className="text-slate-400" />
                    <span className="font-semibold text-slate-700">@{member.github}</span>
                  </div>
                )}
              </div>
            </div>
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

function NodeMesh({ position, color, isVisible, label, scale = 1, showLabel = true, yOffset = 0, hoverable = true, onClick }) {
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
          emissive={color}
          transparent
        />
      </mesh>
      {showLabel && (
        <Html position={[0, -0.8 * scale, 0]} center style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: 'none' }}>
          <div className="text-sm font-bold text-slate-700 bg-white/90 px-3 py-1 rounded shadow-sm backdrop-blur-sm whitespace-nowrap border border-white/50">
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
                  <p className="text-sm text-slate-600 mb-3 font-medium">{n.details}</p>
                  
                  <div className="bg-slate-50 p-2 rounded text-xs space-y-1 border border-slate-100">
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

  // Organize users for the sidebar
  const getSidebarUsers = (areaId) => {
    return allCollaborators.filter(c => c.area === areaId);
  };

  return (
    <div className="w-full h-full relative bg-slate-50 flex overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-80 h-full bg-white shadow-2xl z-20 flex flex-col border-r border-slate-200">
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 backdrop-blur">
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">Mapa Corporativo 3D</h1>
          <p className="text-xs text-slate-500 mt-2 font-medium">Seleccione un área para explorar su flujo de procesos.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {areasData.map((area) => {
            const isSelected = selectedArea?.id === area.id;
            const areaUsers = getSidebarUsers(area.id);
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
                
                {/* Expandable People List in Sidebar */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isSelected ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
                >
                  <div className="bg-slate-50/50 border border-slate-100 rounded-lg p-3 mx-2 shadow-inner">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-1 tracking-widest flex items-center gap-1">
                      <Users size={10} /> Integrantes del Equipo
                    </p>
                    <div className="space-y-0.5">
                      {areaUsers.map((person, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-2 py-1.5 hover:bg-white rounded-md transition-colors text-xs font-medium text-slate-600 shadow-sm border border-transparent hover:border-slate-100">
                          {person.rank === 'ceo' ? <Crown size={12} className="text-amber-500" /> :
                           person.rank === 'gerente' ? <Award size={12} className="text-slate-500" /> :
                           person.rank === 'lead' ? <Terminal size={12} className="text-sky-500" /> :
                           <User size={12} className="text-slate-400" />}
                          <span className="truncate" title={`${person.name} - ${person.role}`}>
                            {person.name}
                          </span>
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
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight drop-shadow-sm">Directorio y Procesos</h2>
          <p className="text-slate-600 mt-1 font-medium bg-white/50 backdrop-blur px-3 py-1 rounded-full inline-block border border-white/50 shadow-sm">
            {selectedArea ? `${selectedArea.name} > ${currentProcess?.name}` : 'Vista Global: Pase el cursor sobre los avatares para ver el perfil.'}
          </p>
        </div>

        {/* Process Tabs */}
        {selectedArea && selectedArea.processes && selectedArea.processes.length > 1 && (
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

        <Canvas camera={{ position: [0, 0, 16], fov: 45 }}>
          <color attach="background" args={['#f8fafc']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Environment preset="city" />

          {/* MACRO VIEW (Nodes + All Collaborators) */}
          <group visible={!selectedArea}>
            <Connections connections={macroConnections} nodes={areasData} color="#cbd5e1" isVisible={!selectedArea} />
            {areasData.map((node) => (
              <NodeMesh
                key={node.id}
                position={node.position}
                color={node.color}
                label={node.name}
                isVisible={!selectedArea}
                hoverable={true}
                onClick={() => handleAreaSelect(node)}
              />
            ))}
            {teamOrbiters.map((member) => (
              <TeamMember key={member.id} member={member} isVisible={!selectedArea} />
            ))}
          </group>

          {/* MICRO / PROCESS FLOW VIEW */}
          {selectedArea && currentProcess && (
            <ProcessFlow 
              process={currentProcess} 
              color={selectedArea.color} 
              isVisible={!!selectedArea}
              activeNodeId={activeNodeId}
              setActiveNodeId={setActiveNodeId} 
            />
          )}

          <ContactShadows position={[0, -5, 0]} opacity={0.4} scale={30} blur={2.5} far={4.5} color="#94a3b8" />
          
          <OrbitControls 
            enablePan={true}
            minPolarAngle={Math.PI / 4} 
            maxPolarAngle={Math.PI / 1.5}
            minDistance={8}
            maxDistance={35}
          />
        </Canvas>
      </div>
    </div>
  );
}
