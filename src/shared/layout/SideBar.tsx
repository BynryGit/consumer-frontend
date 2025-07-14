// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { NAVIGATION_ITEMS } from "@shared/utils/constants";
// import { cn } from "@shared/lib/utils";
// import {
//   Layout,
//   PenLine,
//   MessageSquare,
//   ListChecks,
//   GitBranch,
//   History,
//   FileText,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
// } from "lucide-react";

// export const SideBar: React.FC = () => {
//   const [collapsed, setCollapsed] = React.useState(false);
//   const location = useLocation();

//   const getIcon = (iconName: string) => {
//     switch (iconName) {
//       case "Layout":
//         return <Layout size={20} />;
//       case "PenLine":
//         return <PenLine size={20} />;
//       case "MessageSquare":
//         return <MessageSquare size={20} />;
//       case "ListChecks":
//         return <ListChecks size={20} />;
//       case "GitBranch":
//         return <GitBranch size={20} />;
//       case "History":
//         return <History size={20} />;
//       case "FileText":
//         return <FileText size={20} />;
//       case "Settings":
//         return <Settings size={20} />;
//       default:
//         return <Layout size={20} />;
//     }
//   };

//   // Helper function to get the route path
//   const getRoutePath = (id: string) => {
//     switch (id) {
//       case "dashboard":
//         return "/";
//       case "compose":
//         return "/messaging";
//       case "bulk":
//         return "/messaging";
//       case "lists":
//         return "/lists";
//       case "workflows":
//         return "/workflows";
//       case "history":
//         return "/history";
//       case "templates":
//         return "/templates";
//       case "settings":
//         return "/settings";
//       default:
//         return "/";
//     }
//   };

//   return (
//     <aside
//       className={cn(
//         "bg-sidebar h-screen border-r border-border shadow-sm transition-all duration-300 flex flex-col",
//         collapsed ? "w-16" : "w-64"
//       )}
//     >
//       {/* Logo */}
//       <div className="h-16 flex items-center justify-center border-b border-border">
//         {collapsed ? (
//           <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
//             UC
//           </div>
//         ) : (
//           <h1 className="text-gradient font-bold text-lg">UtilityConnect</h1>
//         )}
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 py-4">
//         <ul className="space-y-1 px-3">
//           {NAVIGATION_ITEMS.map((item) => {
//             const path = getRoutePath(item.id);
//             const isActive = location.pathname === path;

//             return (
//               <li key={item.id}>
//                 <Link
//                   to={path}
//                   className={cn(
//                     "flex items-center gap-3 px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group transition-colors",
//                     isActive &&
//                       "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
//                   )}
//                 >
//                   <span className="text-primary">{getIcon(item.icon)}</span>
//                   {!collapsed && (
//                     <span className="text-sm font-medium">{item.label}</span>
//                   )}
//                   {!collapsed && (
//                     <ChevronRight
//                       size={16}
//                       className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
//                     />
//                   )}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       {/* Toggle Button */}
//       <div className="p-4 border-t border-border">
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="w-full flex items-center justify-center p-2 rounded-md bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 transition-colors"
//         >
//           {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
//         </button>
//       </div>
//     </aside>
//   );
// };
