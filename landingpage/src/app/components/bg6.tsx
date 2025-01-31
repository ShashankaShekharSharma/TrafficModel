'use client'

import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Particle class to manage individual particles
  interface ParticleProps {
    x: number;
    y: number;
    size: number;
    baseX: number;
    baseY: number;
    density: number;
    distance: number;
    color: string;
    speedX: number;
    speedY: number;
  }

  class Particle implements ParticleProps {
    x: number;
    y: number;
    size: number;
    baseX: number;
    baseY: number;
    density: number;
    distance: number;
    color: string;
    speedX: number;
    speedY: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2; // Increased size (2 to 7)
      this.baseX = x;
      this.baseY = y;
      this.density = Math.random() * 30 + 1;
      this.distance = 100;
      this.color = 'rgba(255, 165, 0, 0.8)'; // Orange color
      this.speedX = (Math.random() - 0.5) * 2; // Random speed between -1 and 1
      this.speedY = (Math.random() - 0.5) * 2; // Random speed between -1 and 1
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      // Random movement
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off the walls
      if (this.x < 0 || this.x > (canvasRef.current?.width || 0)) {
        this.speedX = -this.speedX;
      }
      if (this.y < 0 || this.y > (canvasRef.current?.height || 0)) {
        this.speedY = -this.speedY;
      }

      // Mouse interaction
      const dx = mousePosition.current.x - this.x;
      const dy = mousePosition.current.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 100;

      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;

        this.x -= directionX;
        this.y -= directionY;
      } else {
        // Return to base position
        if (this.x !== this.baseX) {
          const dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          const dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };

    const init = () => {
      particles.current = [];
      const numberOfParticles = (canvas.width * canvas.height) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.current.push(new Particle(x, y));
      }
    };

    const drawLines = (ctx: CanvasRenderingContext2D) => {
      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const dx = particles.current[i].x - particles.current[j].x;
          const dy = particles.current[i].y - particles.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 100) {
            ctx.strokeStyle = 'rgba(0, 0, 0, 1)'; // Black lines
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles.current[i].x, particles.current[i].y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background for light mode
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, '#f0f0f0'); // Light gray
      gradient.addColorStop(1, '#ffffff'); // White
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach(particle => {
        particle.update(); // Update particle position
        particle.draw(ctx); // Draw particle
      });

      drawLines(ctx);

      animationFrameId.current = requestAnimationFrame(animate);
    };

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default ParticleBackground;