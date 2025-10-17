// import React from "react";
// import { Bell, MessageCircle, Sun, Moon, Search, Globe } from "lucide-react";

// export const TopBar: React.FC = () => {
//   const [theme, setTheme] = React.useState("light");
//   const [language, setLanguage] = React.useState("en");

//   const toggleTheme = () => {
//     const newTheme = theme === "light" ? "dark" : "light";
//     setTheme(newTheme);
//     document.documentElement.classList.toggle("dark");
//   };

//   const toggleLanguage = () => {
//     setLanguage(language === "en" ? "es" : "en");
//   };

//   return (
//     <div className="h-16 border-b border-border bg-background flex items-center justify-between px-4 md:px-6">
//       {/* Search */}
//       <div className="relative hidden md:flex items-center">
//         <Search className="absolute left-3 text-muted-foreground" size={18} />
//         <input
//           type="search"
//           placeholder="Search..."
//           className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
//         />
//       </div>

//       {/* Mobile Title (shown on small screens) */}
//       <div className="md:hidden">
//         <h1 className="text-gradient font-bold">UtilityConnect</h1>
//       </div>

//       {/* Right side actions */}
//       <div className="flex items-center gap-3">
//         {/* Language Toggle */}
//         <button
//           onClick={toggleLanguage}
//           className="h-9 w-9 rounded-md flex items-center justify-center bg-background hover:bg-accent text-foreground transition-colors"
//           title={language === "en" ? "Switch to Spanish" : "Switch to English"}
//         >
//           <Globe size={18} />
//           <span className="sr-only">Toggle Language</span>
//           <span className="text-xs font-medium ml-1">
//             {language.toUpperCase()}
//           </span>
//         </button>

//         {/* Notifications */}
//         <button
//           className="h-9 w-9 rounded-md flex items-center justify-center bg-background hover:bg-accent text-foreground transition-colors relative"
//           title="Notifications"
//         >
//           <Bell size={18} />
//           <span className="sr-only">Notifications</span>
//           <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
//         </button>

//         {/* Messages */}
//         <button
//           className="h-9 w-9 rounded-md flex items-center justify-center bg-background hover:bg-accent text-foreground transition-colors"
//           title="Messages"
//         >
//           <MessageCircle size={18} />
//           <span className="sr-only">Messages</span>
//         </button>

//         {/* Theme Toggle */}
//         <button
//           onClick={toggleTheme}
//           className="h-9 w-9 rounded-md flex items-center justify-center bg-background hover:bg-accent text-foreground transition-colors"
//           title={
//             theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"
//           }
//         >
//           {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
//           <span className="sr-only">Toggle Theme</span>
//         </button>

//         {/* User Profile */}
//         <div className="flex items-center gap-2 ml-2">
//           <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex-center text-sm font-medium">
//             UC
//           </div>
//           <div className="hidden md:block">
//             <p className="text-sm font-medium leading-none">Admin User</p>
//             <p className="text-xs text-muted-foreground">Utility Admin</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
