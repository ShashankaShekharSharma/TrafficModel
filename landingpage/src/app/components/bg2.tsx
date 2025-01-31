'use client'

import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const vehicles = useRef<Vehicle[]>([]);
  const trafficLights = useRef<TrafficLight[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Vehicle class to represent individual vehicles
  class Vehicle {
    x: number;
    y: number;
    size: number;
    speed: number;
    direction: { x: number; y: number };
    color: string;
    isStopped: boolean;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 10 + 5; // Random size for variety
      this.speed = Math.random() * 2 + 1; // Random speed
      this.direction = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 }; // Random direction
      this.color = `hsl(${Math.random() * 360}, 70%, 50%)`; // Random color
      this.isStopped = false; // Whether the vehicle is stopped at a traffic light
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update(trafficLights: TrafficLight[], vehicles: Vehicle[]) {
      // Move the vehicle if not stopped
      if (!this.isStopped) {
        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;
      }

      // Bounce off the edges of the canvas
      if (this.x < 0 || this.x > (canvasRef.current?.width || 0)) {
        this.direction.x = -this.direction.x;
      }
      if (this.y < 0 || this.y > (canvasRef.current?.height || 0)) {
        this.direction.y = -this.direction.y;
      }

      // Check for traffic lights
      this.isStopped = false;
      for (const light of trafficLights) {
        if (light.isRed && this.distanceTo(light.x, light.y) < 50) {
          this.isStopped = true;
          break;
        }
      }

      // Avoid collisions with other vehicles
      for (const vehicle of vehicles) {
        if (vehicle !== this && this.distanceTo(vehicle.x, vehicle.y) < this.size + vehicle.size) {
          this.direction.x = -this.direction.x;
          this.direction.y = -this.direction.y;
        }
      }
    }

    distanceTo(x: number, y: number) {
      const dx = this.x - x;
      const dy = this.y - y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  }

  // TrafficLight class to simulate traffic lights
  class TrafficLight {
    x: number;
    y: number;
    isRed: boolean;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.isRed = Math.random() > 0.5; // Randomly start as red or green
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.isRed ? 'red' : 'green';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      // Toggle traffic light state every few seconds
      if (Math.random() < 0.01) {
        this.isRed = !this.isRed;
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

    const init = () => {
      vehicles.current = [];
      trafficLights.current = [];

      // Create vehicles
      const numberOfVehicles = 50;
      for (let i = 0; i < numberOfVehicles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        vehicles.current.push(new Vehicle(x, y));
      }

      // Create traffic lights
      const numberOfTrafficLights = 4;
      for (let i = 0; i < numberOfTrafficLights; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        trafficLights.current.push(new TrafficLight(x, y));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw surveillance grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        for (let y = 0; y < canvas.height; y += 50) {
          ctx.beginPath();
          ctx.rect(x, y, 50, 50);
          ctx.stroke();
        }
      }

      // Update and draw traffic lights
      trafficLights.current.forEach(light => {
        light.update();
        light.draw(ctx);
      });

      // Update and draw vehicles
      vehicles.current.forEach(vehicle => {
        vehicle.update(trafficLights.current, vehicles.current);
        vehicle.draw(ctx);
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    handleResize();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
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