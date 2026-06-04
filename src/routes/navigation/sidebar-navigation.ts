import { Award, BadgeCheck, Briefcase, Eye, FolderGit2, Globe, GraduationCap, LayoutTemplate,
  MessageCircle, Settings2,  Upload, User, type LucideIcon} from "lucide-react";

type NavChild = {
  id: string;
  label: string;
  path: string;
};

type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  children?: NavChild[];
};

export const sidebarNavigation: NavItem[] = [
  {
    id: "portafolio",
    label: "Ver mi portafolio",
    icon: Eye,
    path: "/portafolio",
  },
  {
    id: "personal",
    label: "Datos personales",
    icon: User,
    path: "/personal",
    children: [
      { id: "personal-registrar", label: "Registrar datos personales", path: "/registro/completar-perfil" },
      { id: "personal-ver", label: "Ver datos personales", path: "/personal/ver" },
      { id: "personal-editar", label: "Editar datos personales", path: "/personal/editar" },
    ],
  },
  { id: "red-profesional", label: "Red profesional", icon: Globe, path: "/red-profesional" },
  {
    id: "proyectos",
    label: "Proyectos",
    icon: FolderGit2,
    path: "/proyectos",
    children: [
      { id: "proyectos-ver", label: "Ver proyectos", path: "/proyectos/ver" },
      { id: "proyectos-agregar", label: "Registrar proyecto", path: "/proyectos/añadir" },
      { id: "proyectos-editar", label: "Editar proyecto", path: "/proyectos/editar" },
      { id: "proyectos-eliminar", label: "Eliminar proyecto", path: "/proyectos/eliminar" },
    ],
  },
  {
    id: "habilidades",
    label: "Habilidades",
    icon: Award,
    path: "/habilidades",
    children: [
      { id: "habilidades-ver", label: "Ver habilidades", path: "/habilidades/ver" },
      { id: "habilidades-agregar", label: "Registrar habilidad", path: "/habilidades/añadir" },
      { id: "habilidades-editar", label: "Editar habilidad", path: "/habilidades/editar" },
      { id: "habilidades-eliminar", label: "Eliminar habilidad", path: "/habilidades/eliminar" },
    ],
  },
  {
    id: "experiencia",
    label: "Experiencia Laboral",
    icon: Briefcase,
    path: "/experiencia",
    children: [
      { id: "experiencia-ver", label: "Ver Experiencia Laboral", path: "/experiencia/ver" },
      { id: "experiencia-agregar", label: "Registrar Experiencia Laboral", path: "/experiencia/agregar" },
      { id: "experiencia-editar", label: "Editar Experiencia Laboral", path: "/experiencia/editar" },
      { id: "experiencia-eliminar", label: "Eliminar Experiencia Laboral", path: "/experiencia/eliminar" },
    ],
  },
  {
    id: "formacion-academica",
    label: "Formación Académica",
    icon: GraduationCap,
    path: "/formacion-academica",
    children: [
      { id: "formacion-ver", label: "Ver Formación Académica", path: "/formacion-academica/ver" },
      { id: "formacion-agregar", label: "Registrar Formación Académica", path: "/formacion-academica/agregar" },
      { id: "formacion-editar", label: "Editar Formación Académica", path: "/formacion-academica/editar" },
      { id: "formacion-eliminar", label: "Eliminar Formación Académica", path: "/formacion-academica/eliminar" },
    ],
  },
  {
    id: "certificados",
    label: "Certificados",
    icon: BadgeCheck,
    path: "/certificados",
    children: [
      { id: "certificados-ver", label: "Ver certificados", path: "/certificados/ver" },
      { id: "certificados-agregar", label: "Registrar certificado", path: "/certificados/añadir" },
      { id: "certificados-eliminar", label: "Eliminar certificado", path: "/certificados/eliminar" },
    ],
  },
  { id: "plantillas", label: "Plantillas", icon: LayoutTemplate, path: "/plantillas" },
  { id: "mensajes", label: "Mensajes", icon: MessageCircle, path: "/mensajes" },
  { id: "configuracion-visibilidad", label: "Configuración de visibilidad", icon: Settings2, path: "/configuracion-visibilidad" },
  { id: "publicar", label: "Publicar", icon: Upload, path: "/publicar" },
];