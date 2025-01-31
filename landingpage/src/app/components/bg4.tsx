'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleBackground = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Road network
    const roadGeometry = new THREE.BoxGeometry(50, 0.1, 5);
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.receiveShadow = true;
    scene.add(road);

    // Vehicles
    const vehicles: THREE.Mesh[] = [];
    const vehicleGeometry = new THREE.BoxGeometry(1, 0.5, 1);
    const vehicleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });

    for (let i = 0; i < 10; i++) {
      const vehicle = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
      vehicle.position.set(Math.random() * 40 - 20, 0.5, Math.random() * 4 - 2);
      vehicle.castShadow = true;
      vehicles.push(vehicle);
      scene.add(vehicle);
    }

    // Traffic lights
    const trafficLights: THREE.Mesh[] = [];
    const trafficLightGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1);
    const trafficLightMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

    for (let i = 0; i < 2; i++) {
      const trafficLight = new THREE.Mesh(trafficLightGeometry, trafficLightMaterial);
      trafficLight.position.set(i * 20 - 10, 1, 2.5);
      trafficLight.castShadow = true;
      trafficLights.push(trafficLight);
      scene.add(trafficLight);
    }

    // Heatmap overlay
    const heatmapTexture = new THREE.TextureLoader().load('/heatmap.png'); // Replace with your heatmap texture
    const heatmapMaterial = new THREE.MeshBasicMaterial({
      map: heatmapTexture,
      transparent: true,
      opacity: 0.5,
    });
    const heatmapGeometry = new THREE.PlaneGeometry(50, 5);
    const heatmap = new THREE.Mesh(heatmapGeometry, heatmapMaterial);
    heatmap.position.set(0, 0.1, 0);
    heatmap.rotation.x = -Math.PI / 2;
    scene.add(heatmap);

    // Camera position
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Move vehicles
      vehicles.forEach((vehicle) => {
        vehicle.position.x += 0.05;
        if (vehicle.position.x > 25) vehicle.position.x = -25;
      });

      // Toggle traffic lights
      trafficLights.forEach((light, index) => {
        if (Math.random() < 0.01) {
          if (light.material instanceof THREE.MeshStandardMaterial) {
            light.material.color.set(index === 0 ? 0xff0000 : 0x00ff00);
          }
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default ParticleBackground;