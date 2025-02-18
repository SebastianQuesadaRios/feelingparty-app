<template>
  <ClientOnly>
    <div class="balloons-container">
      <div v-for="n in 12" :key="n" 
           class="balloon" 
           :style="{
             '--delay': `${Math.random() * 5}s`,
             '--duration': `${10 + Math.random() * 10}s`,
             '--left': `${(n-1) * 8.33}%`,
             '--offset': `${Math.random() * 15 - 7.5}%`,
             '--hue': `${Math.random() * 360}deg`,
             '--scale': `${0.7 + Math.random() * 0.6}`
           }">
        <div class="balloon-string"></div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.balloons-container {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.balloon {
  position: absolute;
  bottom: -100px;
  left: calc(var(--left) + var(--offset));
  transform: scale(var(--scale));
  animation: float var(--duration) linear infinite;
  animation-delay: var(--delay);
}

.balloon::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 50px;
  background: hsl(var(--hue), 90%, 65%);
  border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
  box-shadow: inset -5px -5px 10px rgba(0,0,0,0.1);
  animation: sway 2s ease-in-out infinite;
  transform-origin: center bottom;
}

.balloon-string {
  position: absolute;
  width: 1px;
  height: 40px;
  background: rgba(200,200,200,0.5);
  top: 48px;
  left: 20px;
  transform-origin: top center;
  animation: swing 2s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0) scale(var(--scale));
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
  }
  100% {
    transform: translateY(-120vh) scale(var(--scale));
    opacity: 0;
  }
}

@keyframes sway {
  0%, 100% {
    transform: rotate(-5deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes swing {
  0%, 100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
}
</style> 