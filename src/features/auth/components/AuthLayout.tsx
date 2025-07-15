
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-4 relative overflow-hidden">
      {/* Animated background mesh pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 animate-gradient-x"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      {/* Large animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-bounce-slow"></div>
        <div className="absolute top-1/4 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-xl animate-pulse-slow"></div>
        
        {/* Additional large colorful elements */}
        <div className="absolute top-10 left-1/2 w-40 h-40 bg-gradient-to-br from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute bottom-10 right-1/4 w-60 h-60 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl animate-spin-slow"></div>
        
        {/* New large animated blobs */}
        <div className="absolute top-1/3 right-10 w-48 h-48 bg-gradient-to-br from-yellow-400/12 to-orange-400/12 rounded-full blur-3xl animate-bounce-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-10 w-56 h-56 bg-gradient-to-br from-rose-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2.5s'}}></div>
        <div className="absolute top-20 right-1/3 w-44 h-44 bg-gradient-to-br from-violet-400/12 to-purple-400/12 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '0.8s'}}></div>
      </div>

      {/* Enhanced floating geometric shapes with more variety */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating circles with more variety */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-300/30 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-purple-300/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/3 w-3 h-3 bg-indigo-300/40 rounded-full animate-ping delay-500"></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-pink-300/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/3 left-10 w-4 h-4 bg-emerald-300/30 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-2/3 right-10 w-5 h-5 bg-cyan-300/30 rounded-full animate-bounce delay-900"></div>
        
        {/* New floating circles */}
        <div className="absolute top-16 left-1/4 w-7 h-7 bg-amber-300/25 rounded-full animate-float delay-400"></div>
        <div className="absolute bottom-40 right-1/3 w-4 h-4 bg-teal-300/35 rounded-full animate-bounce-slow delay-600"></div>
        <div className="absolute top-56 right-16 w-5 h-5 bg-lime-300/30 rounded-full animate-pulse-slow delay-1200"></div>
        <div className="absolute bottom-24 left-1/4 w-6 h-6 bg-fuchsia-300/25 rounded-full animate-float-reverse delay-800"></div>
        <div className="absolute top-72 left-16 w-3 h-3 bg-sky-300/40 rounded-full animate-ping delay-1500"></div>
        
        {/* Floating squares and diamonds with more animations */}
        <div className="absolute top-60 left-12 w-8 h-8 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rotate-45 animate-spin-slow delay-300"></div>
        <div className="absolute bottom-40 right-12 w-6 h-6 bg-gradient-to-br from-indigo-200/25 to-pink-200/25 rotate-12 animate-pulse delay-800"></div>
        <div className="absolute top-32 right-1/4 w-7 h-7 bg-gradient-to-br from-orange-200/20 to-yellow-200/20 rotate-45 animate-float"></div>
        <div className="absolute bottom-60 left-1/4 w-5 h-5 bg-gradient-to-br from-green-200/25 to-teal-200/25 rotate-12 animate-bounce-slow"></div>
        
        {/* New floating squares */}
        <div className="absolute top-24 left-1/3 w-9 h-9 bg-gradient-to-br from-rose-200/18 to-red-200/18 rotate-12 animate-float-reverse delay-1000"></div>
        <div className="absolute bottom-32 right-1/4 w-4 h-4 bg-gradient-to-br from-violet-200/30 to-purple-200/30 rotate-45 animate-spin-slow delay-2000"></div>
        <div className="absolute top-40 left-16 w-6 h-6 bg-gradient-to-br from-cyan-200/22 to-blue-200/22 rotate-30 animate-bounce-slow delay-1500"></div>
        
        {/* Floating triangles with enhanced animations */}
        <div className="absolute top-16 left-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-purple-300/30 animate-float delay-200"></div>
        <div className="absolute bottom-16 right-1/2 w-0 h-0 border-l-5 border-r-5 border-b-10 border-l-transparent border-r-transparent border-b-blue-300/30 animate-bounce delay-600"></div>
        <div className="absolute top-52 left-20 w-0 h-0 border-l-3 border-r-3 border-b-6 border-l-transparent border-r-transparent border-b-emerald-300/35 animate-pulse-slow delay-900"></div>
        <div className="absolute bottom-48 right-20 w-0 h-0 border-l-4 border-r-4 border-b-7 border-l-transparent border-r-transparent border-b-amber-300/28 animate-float-reverse delay-1300"></div>
        
        {/* Floating hexagons with more variety */}
        <div className="absolute top-48 right-16 w-6 h-6 bg-gradient-to-br from-violet-200/20 to-purple-200/20 transform rotate-30 animate-spin-slow delay-400" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
        <div className="absolute bottom-48 left-16 w-8 h-8 bg-gradient-to-br from-rose-200/20 to-pink-200/20 transform rotate-45 animate-pulse delay-1200" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
        <div className="absolute top-36 right-1/3 w-7 h-7 bg-gradient-to-br from-teal-200/25 to-cyan-200/25 transform rotate-60 animate-float delay-1600" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>
        
        {/* New star shapes */}
        <div className="absolute top-28 right-24 w-6 h-6 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 animate-spin-slow delay-500" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
        <div className="absolute bottom-36 left-24 w-5 h-5 bg-gradient-to-br from-lime-200/25 to-green-200/25 animate-pulse-slow delay-1800" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
        
        {/* Floating crosses/plus signs */}
        <div className="absolute top-64 right-32 w-8 h-2 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 animate-float delay-700">
          <div className="absolute top-1/2 left-1/2 w-2 h-8 bg-gradient-to-b from-indigo-200/20 to-purple-200/20 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="absolute bottom-56 left-32 w-6 h-1.5 bg-gradient-to-r from-pink-200/25 to-rose-200/25 animate-bounce-slow delay-1100">
          <div className="absolute top-1/2 left-1/2 w-1.5 h-6 bg-gradient-to-b from-pink-200/25 to-rose-200/25 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        {/* Floating ovals/ellipses */}
        <div className="absolute top-44 left-28 w-10 h-5 bg-gradient-to-r from-sky-200/15 to-blue-200/15 rounded-full animate-float-reverse delay-1400"></div>
        <div className="absolute bottom-44 right-28 w-8 h-4 bg-gradient-to-r from-violet-200/20 to-purple-200/20 rounded-full animate-pulse delay-2200"></div>
        
        {/* Moving wave patterns */}
        <div className="absolute top-1/4 left-0 w-full h-1 opacity-20">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-blue-300 to-transparent animate-pulse" style={{clipPath: 'polygon(0 0, 100% 0, 98% 100%, 2% 100%)'}}></div>
        </div>
        <div className="absolute bottom-1/4 left-0 w-full h-1 opacity-15">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-purple-300 to-transparent animate-float" style={{clipPath: 'polygon(2% 0, 98% 0, 100% 100%, 0% 100%)'}}></div>
        </div>
      </div>

      {/* Enhanced animated background grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          animation: 'grid-move 20s linear infinite'
        }}></div>
        {/* Additional diagonal grid */}
        <div className="absolute inset-0 h-full w-full opacity-30" style={{
          backgroundImage: `linear-gradient(45deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px),
                           linear-gradient(-45deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
          backgroundSize: '15px 15px',
          animation: 'grid-move 25s linear infinite reverse'
        }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 relative">
          {/* Enhanced inner glow with color variations */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-blue-50/20 to-purple-50/20 rounded-2xl pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-t-2xl"></div>
          
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-3xl font-bold bg-gradient-to-br from-slate-800 via-purple-700 to-blue-700 bg-clip-text text-transparent mb-2">{title}</h1>
            {subtitle && (
              <p className="text-slate-600 text-sm">{subtitle}</p>
            )}
          </div>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
