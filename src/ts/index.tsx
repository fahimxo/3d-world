import React, { useRef, useEffect } from "react";
import World from "./world/Word"; // Corrected import from 'Word' to 'World'
import { DataType } from "src/app";

// Define the props for the component
interface WorldComponentProps {
  onCityClick: (name: string, data: string) => void;
  data: DataType;
}

const WorldComponent: React.FC<WorldComponentProps> = ({
  onCityClick,
  data,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const worldInstance = useRef<World | null>(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) {
      return;
    }

    // Only create a new World instance if one doesn't already exist.
    if (!worldInstance.current) {
      worldInstance.current = new World({
        dom: currentMount,
        // Pass the callback function to your World class
        // You will need to update your IWord interface and World constructor to accept this
        onPointClick: (data) => onCityClick(data.name, JSON.stringify(data)),
        data: data,
      });
    }

    // The cleanup function will be called when the component is unmounted.
    return () => {
      // To prevent memory leaks, you should add a 'destroy' method to your World class
      // that cleans up event listeners, geometries, materials, etc.
      // worldInstance.current?.destroy();
      if (currentMount) {
        while (currentMount.firstChild) {
          currentMount.removeChild(currentMount.firstChild);
        }
      }
      worldInstance.current = null;
    };
  }, [onCityClick]);

  // This div is the container where your Three.js canvas will be placed.
  // It will be styled to be in the background.
  return <div id="earth-canvas" ref={mountRef} />;
};

export default WorldComponent;
