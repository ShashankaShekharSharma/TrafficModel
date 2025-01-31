'use client'

import React, { useEffect, useRef, useState } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const vehicles = useRef<Vehicle[]>([]);
  const trafficLights = useRef<TrafficLight[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const [hoveredVehicle, setHoveredVehicle] = useState<Vehicle | null>(null);

  // Vehicle class to represent individual vehicles
  class Vehicle {
    x: number;
    y: number;
    size: number;
    speed: number;
    maxSpeed: number;
    direction: { x: number; y: number };
    color: string;
    trail: { x: number; y: number }[];
    isStopped: boolean;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 10 + 5;
      this.speed = Math.random() * 2 + 1;
      this.maxSpeed = this.speed;
      this.direction = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
      this.color = `hsl(${Math.random() * 360}, 100%, 70%)`;
      this.trail = [];
      this.isStopped = false;
    }

    draw(ctx: CanvasRenderingContext2D) {
      // Draw vehicle
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      // Draw glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw trail
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      this.trail.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }

    update(trafficLights: TrafficLight[], vehicles: Vehicle[]) {
      // Add current position to trail
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 20) this.trail.shift();

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
          this.speed = Math.max(0, this.speed - 0.1); // Smooth deceleration
          break;
        }
      }

      // Accelerate if not stopped
      if (!this.isStopped && this.speed < this.maxSpeed) {
        this.speed += 0.1;
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
      this.isRed = Math.random() > 0.5;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.fillStyle = this.isRed ? 'red' : 'green';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      // Draw glow
      ctx.shadowBlur = 20;
      ctx.shadowColor = this.isRed ? 'red' : 'green';
      ctx.fill();
      ctx.shadowBlur = 0;
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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Check if mouse is hovering over a vehicle
      const hovered = vehicles.current.find(
        (vehicle) => vehicle.distanceTo(mouseX, mouseY) < vehicle.size
      );
      setHoveredVehicle(hovered || null);
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

    const drawHeatmap = (ctx: CanvasRenderingContext2D) => {
      const heatmap = new Array(canvas.width * canvas.height).fill(0);

      // Calculate traffic density
      vehicles.current.forEach((vehicle) => {
        const x = Math.floor(vehicle.x);
        const y = Math.floor(vehicle.y);
        if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
          heatmap[y * canvas.width + x] += 1;
        }
      });

      // Draw heatmap
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < heatmap.length; i++) {
        const intensity = Math.min(heatmap[i], 5) / 5; // Normalize intensity
        imageData.data[i * 4] = 255 * intensity; // Red
        imageData.data[i * 4 + 1] = 0; // Green
        imageData.data[i * 4 + 2] = 0; // Blue
        imageData.data[i * 4 + 3] = 100 * intensity; // Alpha
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw heatmap
      drawHeatmap(ctx);

      // Update and draw traffic lights
      trafficLights.current.forEach((light) => {
        light.update();
        light.draw(ctx);
      });

      // Update and draw vehicles
      vehicles.current.forEach((vehicle) => {
        vehicle.update(trafficLights.current, vehicles.current);
        vehicle.draw(ctx);
      });

      // Draw hovered vehicle info
      if (hoveredVehicle) {
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(
          `Speed: ${hoveredVehicle.speed.toFixed(2)}`,
          hoveredVehicle.x + 10,
          hoveredVehicle.y - 10
        );
      }

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