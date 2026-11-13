"use client";

import React, { useEffect, useRef } from 'react';

const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    
    // Config
    const particleCount = 100;
    const connectionDistance = 150;
    const mouseRadius = 150;
    
    // Mouse state
    const mouse = { x: -1000, y: -1000, active: false };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.size = Math.random() * 2 + 1;
        // Warm champagne beige particles
        this.color = 'rgba(229, 211, 179, 0.28)'; 
      }

      update() {
        // Natural drift
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls smoothly
        if (this.x < 0 || this.x > canvas!.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.vy *= -1;

        // Mouse interaction (lerp)
        if (mouse.active) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius) {
            // Lerp towards mouse smoothly
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            
            // The closer it is, the stronger the pull, but keep it gentle
            const force = (mouseRadius - distance) / mouseRadius;
            
            // Move toward cursor slowly (lerp factor 0.03)
            this.x += forceDirectionX * force * 1.5;
            this.y += forceDirectionY * force * 1.5;
            
            // Interactive Mouse Glow Accent (Warm Champagne Gold)
            this.color = 'rgba(229, 211, 179, 0.65)';
          } else {
            this.color = 'rgba(229, 211, 179, 0.28)';
          }
        } else {
          this.color = 'rgba(229, 211, 179, 0.28)';
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - (distance / connectionDistance);
            
            // Faint warm beige lines
            ctx.beginPath();
            ctx.strokeStyle = `rgba(229, 211, 179, ${opacity * 0.12})`; 
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const render = () => {
      // Draw background base color (Deep Obsidian Black)
      ctx.fillStyle = '#08080A'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        particle.update();
        particle.draw();
      }
      
      drawConnections();
      
      animationFrameId = requestAnimationFrame(render);
    };

    handleResize();
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none w-full h-full"
    />
  );
};

export default MatrixBackground;
