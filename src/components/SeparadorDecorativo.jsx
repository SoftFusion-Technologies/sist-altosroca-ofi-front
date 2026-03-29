/**
 * 🎨 SeparadorDecorativo — Separador visual con efectos metálicos, brillo, partículas y colores personalizables
 * 
 * Ideal para transiciones entre secciones. Soporta 4 formas: onda, curva, diagonal, montaña.
 * Incluye gradientes dinámicos, brillo ajustable, partículas flotantes y modo pulso.
 * ¡Todo sin CSS externo! Solo props.
 * 
 * ────────────────────────────────
 * 💡 USO RÁPIDO — Copia y pega estos ejemplos:
 * 
 *   // Onda suave hacia abajo (por defecto)
 *   <SeparadorDecorativo />
 * 
 *   // Montaña grande hacia arriba
 *   <SeparadorDecorativo direction="up" variant="mountain" height="large" />
 * 
 *   // Curva con colores personalizados y pulso
 *   <SeparadorDecorativo variant="curve" colorStart="#ff6b6b" colorEnd="#4ecdc4" pulse />
 * 
 *   // Diagonal sutil sin partículas
 *   <SeparadorDecorativo variant="diagonal" opacity={0.5} noParticles />
 * 
 *   // Hero → transición suave
 *   <SeparadorDecorativo variant="curve" height="large" colorStart="#1f2937" colorEnd="#6b7280" opacity={0.7} />
 * 
 *   // Testimonios → montaña verde invertida
 *   <SeparadorDecorativo variant="mountain" direction="up" colorStart="#065f46" colorEnd="#10b981" glowIntensity={4} />
 * 
 *   // Precios → diagonal minimalista
 *   <SeparadorDecorativo variant="diagonal" opacity={0.4} colorStart="#7c3aed" colorEnd="#a78bfa" noParticles />
 * 
 *   // Sobre Nosotros → onda cálida con pulso
 *   <SeparadorDecorativo variant="wave" pulse colorStart="#7c2d12" colorEnd="#f59e0b" height="small" />
 * 
 *   // Fondo oscuro → separador blanco brillante
 *   <SeparadorDecorativo variant="wave" direction="up" colorStart="#374151" colorEnd="#f9fafb" glowIntensity={5} />
 * 
 *   // Fondo claro → separador oscuro elegante
 *   <SeparadorDecorativo variant="mountain" colorStart="#111827" colorEnd="#4b5563" opacity={0.9} height="large" noParticles />
 * 
 *   // Contacto → curva azul brillante con pulso
 *   <SeparadorDecorativo variant="curve" direction="up" colorStart="#1e40af" colorEnd="#60a5fa" glowIntensity={5} pulse />
 * 
 *   // Equipo → onda morada con partículas rápidas
 *   <SeparadorDecorativo variant="wave" colorStart="#701a75" colorEnd="#c084fc" speed="fast" />
 * 
 *   // FAQ → diagonal gris ultra sutil
 *   <SeparadorDecorativo variant="diagonal" direction="up" opacity={0.3} colorStart="#374151" colorEnd="#9ca3af" noParticles height="small" />
 * 
 *   // Blog → montaña naranja cálida
 *   <SeparadorDecorativo variant="mountain" colorStart="#9a3412" colorEnd="#fb923c" pulse height="medium" />
 * 
 *   // Descarga → curva verde “portal”
 *   <SeparadorDecorativo variant="curve" direction="up" colorStart="#047857" colorEnd="#34d399" glowIntensity={5} pulse height="large" />
 * 
 *   // Entre banners → ultra sutil
 *   <SeparadorDecorativo variant="wave" height="small" opacity={0.2} colorStart="#6b7280" colorEnd="#9ca3af" noParticles />
 * 
 *   // Estadísticas → onda azul tecnológica
 *   <SeparadorDecorativo variant="wave" colorStart="#1e3a8a" colorEnd="#3b82f6" speed="fast" glowIntensity={4} pulse />
 * 
 *   // Galería → montaña morada como marco
 *   <SeparadorDecorativo variant="mountain" direction="up" height="small" colorStart="#4c1d95" colorEnd="#a78bfa" opacity={0.7} />
 * 
 *   // Footer → curva elegante para cerrar
 *   <SeparadorDecorativo variant="curve" direction="up" height="medium" colorStart="#1f2937" colorEnd="#374151" opacity={0.6} noParticles />
 * 
 *   // ¡FIESTA! → onda roja con brillo máximo y partículas rápidas 🎉
 *   <SeparadorDecorativo variant="wave" colorStart="#be123c" colorEnd="#f43f5e" pulse speed="fast" glowIntensity={5} height="large" />
 * 
 * ────────────────────────────────
 * ⚙️ PROPIEDADES:
 * 
 *   variant        → 'wave' | 'curve' | 'diagonal' | 'mountain'   (por defecto: 'wave')
 *   direction      → 'down' | 'up'                               (por defecto: 'down')
 *   height         → 'small' | 'medium' | 'large'               (por defecto: 'medium')
 *   opacity        → número entre 0 y 1                          (por defecto: 0.6)
 *   colorStart     → color inicial del gradiente                 (por defecto: '#374151')
 *   colorEnd       → color central del gradiente                 (por defecto: '#d1d5db')
 *   pulse          → boolean - animación de pulso suave          (por defecto: false)
 *   speed          → 'slow' | 'normal' | 'fast' - velocidad partículas (por defecto: 'normal')
 *   noParticles    → boolean - desactiva partículas              (por defecto: false)
 *   glowIntensity  → número 0-5 - intensidad del brillo         (por defecto: 3)
 * 
 * ✨ EFECTOS INCLUIDOS (sin CSS externo):
 * - Gradiente metálico dinámico
 * - Brillo SVG con intensidad variable
 * - Sombra desplazada
 * - Hasta 8 partículas animadas con posición y velocidad aleatoria
 * - Animación de pulso (opacity) si se activa
 * - Degradado de integración en bordes superior/inferior
 * 
 * 📐 Alturas:
 *   small:  60px
 *   medium: 100px
 *   large:  150px
 */

const SeparadorDecorativo = ({ 
  variant = 'wave', 
  direction = 'down', 
  height = 'medium',
  opacity = 0.6,
  colorStart = '#374151',
  colorEnd = '#d1d5db',
  pulse = false,
  speed = 'normal',
  noParticles = false,
  glowIntensity = 3
}) => {
  
  // Configuración de alturas
  const heights = {
    small: { h: 60, viewBox: '0 0 1200 60' },
    medium: { h: 100, viewBox: '0 0 1200 100' },
    large: { h: 150, viewBox: '0 0 1200 150' }
  };
  
  const currentHeight = heights[height];
  
  // Paths SVG
  const paths = {
    wave: {
      down: `M0,0 C300,${currentHeight.h * 0.8} 900,${currentHeight.h * 0.2} 1200,${currentHeight.h * 0.6} L1200,${currentHeight.h} L0,${currentHeight.h} Z`,
      up: `M0,${currentHeight.h} C300,${currentHeight.h * 0.2} 900,${currentHeight.h * 0.8} 1200,${currentHeight.h * 0.4} L1200,0 L0,0 Z`
    },
    curve: {
      down: `M0,0 Q600,${currentHeight.h} 1200,0 L1200,${currentHeight.h} L0,${currentHeight.h} Z`,
      up: `M0,${currentHeight.h} Q600,0 1200,${currentHeight.h} L1200,0 L0,0 Z`
    },
    diagonal: {
      down: `M0,0 L1200,${currentHeight.h * 0.7} L1200,${currentHeight.h} L0,${currentHeight.h} Z`,
      up: `M0,${currentHeight.h} L1200,${currentHeight.h * 0.3} L1200,0 L0,0 Z`
    },
    mountain: {
      down: `M0,${currentHeight.h} L600,0 L1200,${currentHeight.h} Z`,
      up: `M0,0 L600,${currentHeight.h} L1200,0 Z`
    }
  };

  const selectedPath = paths[variant][direction];

  // Mapeo de velocidad
  const speedMap = {
    slow: 0.6,
    normal: 1,
    fast: 1.8
  };

  // Intensidad de brillo (0 a 5 → 0 a 4 en stdDeviation)
  const blurStdDev = Math.min(Math.max(glowIntensity, 0), 5) * 0.8;

  return (
    <div 
      className={`relative w-full overflow-hidden bg-black ${pulse ? 'animate-pulse' : ''}`} 
      style={{ height: `${currentHeight.h}px` }}
    >
      {/* SVG */}
      <svg
        viewBox={currentHeight.viewBox}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradiente metálico */}
          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorStart} stopOpacity={opacity * 0.3} />
            <stop offset="25%" stopColor={colorEnd} stopOpacity={opacity * 0.5} />
            <stop offset="50%" stopColor={colorEnd} stopOpacity={opacity * 0.9} />
            <stop offset="75%" stopColor={colorEnd} stopOpacity={opacity * 0.5} />
            <stop offset="100%" stopColor={colorStart} stopOpacity={opacity * 0.3} />
          </linearGradient>

          {/* Gradiente de resplandor */}
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="#ffffff" stopOpacity={opacity * 0.1} />
            <stop offset="50%" stopColor="#ffffff" stopOpacity={opacity * 0.25} />
            <stop offset="80%" stopColor="#ffffff" stopOpacity={opacity * 0.1} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Filtro de brillo */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={blurStdDev} result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Filtro de sombra */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Sombra base */}
        <path
          d={selectedPath}
          fill="#000000"
          opacity={opacity * 0.2}
          transform="translate(0, 3)"
          filter="url(#shadow)"
        />

        {/* Forma principal */}
        <path
          d={selectedPath}
          fill="url(#metalGradient)"
          filter="url(#glow)"
        />

        {/* Brillo superior */}
        <path
          d={selectedPath}
          fill="url(#glowGradient)"
          opacity={opacity}
        />
      </svg>

      {/* Partículas (solo si no están desactivadas) */}
      {!noParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${10 + i * 12}%`,
                top: `${25 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${2 + i * 0.2 * speedMap[speed]}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            />
          ))}
        </div>
      )}

      {/* Degradado de integración en bordes */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: direction === 'down' 
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.8) 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.8) 100%)'
        }}
      />
    </div>
  );
};

export default SeparadorDecorativo;