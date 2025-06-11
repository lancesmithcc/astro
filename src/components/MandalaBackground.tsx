import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MandalaBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elements: HTMLElement[] = [];

    // Create very simple, minimal mandala layers
    const createMinimalMandalaLayer = (
      count: number,
      radius: number,
      size: number,
      opacity: number,
      rotationSpeed: number,
      color: string,
      layerIndex: number
    ) => {
      const layerGroup = document.createElement('div');
      layerGroup.className = `mandala-layer-${layerIndex}`;
      layerGroup.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: ${radius * 2}px;
        height: ${radius * 2}px;
      `;
      container.appendChild(layerGroup);
      elements.push(layerGroup);

      // Create simple dots instead of triangles
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('div');
        const angle = (360 / count) * i;
        
        dot.style.cssText = `
          position: absolute;
          left: 50%;
          top: 50%;
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border-radius: 50%;
          transform: translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px);
          transform-origin: 50% ${radius}px;
          opacity: ${opacity};
        `;
        
        layerGroup.appendChild(dot);
      }

      // Very slow rotation
      gsap.to(layerGroup, {
        rotation: 360,
        duration: rotationSpeed,
        ease: 'none',
        repeat: -1
      });

      elements.push(layerGroup);
    };

    // Create just 3 minimal layers
    const layers = [
      { count: 6, radius: 100, size: 3, opacity: 0.04, rotSpeed: 120, color: 'rgba(168, 85, 247, 0.04)' },
      { count: 8, radius: 160, size: 2, opacity: 0.03, rotSpeed: 180, color: 'rgba(217, 70, 239, 0.03)' },
      { count: 12, radius: 220, size: 2, opacity: 0.02, rotSpeed: 240, color: 'rgba(192, 38, 211, 0.02)' }
    ];

    // Create each layer
    layers.forEach((layer, index) => {
      createMinimalMandalaLayer(
        layer.count,
        layer.radius,
        layer.size,
        layer.opacity,
        layer.rotSpeed,
        layer.color,
        index
      );
    });

    // Simple central point
    const centerCore = document.createElement('div');
    centerCore.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      width: 8px;
      height: 8px;
      transform: translate(-50%, -50%);
      border: 1px solid rgba(168, 85, 247, 0.08);
      border-radius: 50%;
      background: rgba(168, 85, 247, 0.02);
    `;
    container.appendChild(centerCore);
    elements.push(centerCore);

    // Very slow center rotation
    gsap.to(centerCore, {
      rotation: 360,
      duration: 60,
      ease: 'none',
      repeat: -1
    });

    return () => {
      elements.forEach(element => element.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -10 }} // Between astrological background (-20) and content (10)
    />
  );
};

export default MandalaBackground;