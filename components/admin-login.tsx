"use client"

import { useState } from "react"
import { Lock, User, Eye, EyeOff, MapPin } from "lucide-react"

interface AdminLoginProps {
  onNavigate: (page: string) => void
  onLogin: () => void
}

export default function AdminLogin({ onNavigate, onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple validation - in production, this should be a proper auth system
    if (username === "admin" && password === "1of1admin") {
      setTimeout(() => {
        setIsLoading(false)
        onLogin()
      }, 1000)
    } else {
      setTimeout(() => {
        setIsLoading(false)
        setError("Usuario o contraseña incorrectos")
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Image */}
        <div className="relative w-full lg:w-1/2 h-[30vh] sm:h-[35vh] lg:h-screen flex-shrink-0">
          <img
            src="https://f005.backblazeb2.com/file/b21of1firm/background/CONTACThome.jpg"
            alt="1OF1 Admin Access"
            className="w-full h-full object-cover object-center lg:object-left"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black lg:hidden" />
          
          {/* Back button */}
          <button
            onClick={() => onNavigate("home")}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white/70 hover:text-amber-500 transition-colors text-[10px] sm:text-xs tracking-[0.2em] flex items-center gap-2 bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm"
          >
            <span className="rotate-180">&#10132;</span> VOLVER
          </button>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 lg:py-0 bg-black flex-1">
          <div className="w-full max-w-sm sm:max-w-md">
            {/* Logo */}
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <img 
                src="/logo.png" 
                alt="1 OF 1 FIRM" 
                className="h-12 sm:h-16 md:h-20 w-auto mx-auto"
              />
            </div>

            {/* Title */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-amber-500/90 text-base sm:text-lg lg:text-xl tracking-[0.2em] sm:tracking-[0.3em] font-light">ADMIN ACCESS</h2>
              <div className="flex justify-center mt-3 sm:mt-4">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500/60" />
              </div>
              <p className="text-white/50 text-[10px] sm:text-xs tracking-wide mt-3 sm:mt-4 px-4">
                Ingresa tus credenciales para acceder<br />
                al panel administrativo
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-white/70 text-[10px] sm:text-xs tracking-[0.2em] mb-2 sm:mb-3">
                  USUARIO
                </label>
                <div className="relative">
                  <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ingresa tu usuario"
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-3 sm:py-4 pl-10 sm:pl-12 pr-4 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-white/70 text-[10px] sm:text-xs tracking-[0.2em] mb-2 sm:mb-3">
                  CONTRASEÑA
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className="w-full bg-white/5 border border-white/20 rounded-lg py-3 sm:py-4 pl-10 sm:pl-12 pr-12 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-400 text-xs text-center">{error}</p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 sm:py-4 border border-amber-500/50 text-amber-500 text-xs sm:text-sm tracking-[0.15em] sm:tracking-[0.2em] hover:bg-amber-500 hover:text-black transition-all duration-300 rounded-lg flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                {isLoading ? "VERIFICANDO..." : "INICIAR SESIÓN"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 sm:py-6 text-center bg-black border-t border-white/5 flex-shrink-0">
        <div className="flex items-center justify-center gap-2 text-white/40">
          <MapPin className="w-3 h-3" />
          <span className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em]">BARRANQUILLA, COLOMBIA</span>
        </div>
        <p className="text-amber-500/60 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] mt-2">#UNIQUEEXPERIENCE</p>
      </footer>
    </div>
  )
}
