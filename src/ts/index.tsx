import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import World from './world/Word'; // Corrected import from 'Word' to 'World'
import { ComboboxOption } from 'src/components';
import { DataType } from 'src/lib/usePublicClubs';
import { lockClub } from '../components/ClubInfo';

// Define the props for the component
interface WorldComponentProps {
  onCityClick: (name: string, data: string) => void;
  data: DataType[];
  cityList: ComboboxOption[];
  countryList: ComboboxOption[];
  onLoaded: () => void;
  setFilterModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface WorldHandle {
  rotateToCoordinates: (lat: number, lon: number) => void;
}

const WorldComponent = forwardRef<WorldHandle, WorldComponentProps>(
  (
    {
      onCityClick,
      data,
      cityList,
      onLoaded,
      setFilterModalVisible,
      countryList,
    },
    ref
  ) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const worldInstance = useRef<World | null>(null);

    useImperativeHandle(ref, () => ({
      // This makes the rotateToCoordinates function available on the ref
      rotateToCoordinates(lat, lon) {
        worldInstance.current?.rotateToCoordinates(lat, lon);
      },
    }));

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
          onPointClick: (data) => {
            if (data?.lockStatus === lockClub.unLock) {
              // بستن مودال فیلتر وقتی روی کلاب کلیک می‌شود
              setFilterModalVisible(false);
              onCityClick(data.city, JSON.stringify(data));
            }
          },
          data: [],
          cityList: [],
          countryList: [],
          onLoaded: onLoaded,
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

    useEffect(() => {
      // When the 'data' prop changes and is not empty, update the world
      if (worldInstance.current && data && data.length > 0) {
        worldInstance.current.updateData({
          clubList: data,
          cityList,
          countryList,
        });
      }
    }, [data]); // This effect runs whenever the 'data' prop changes

    // Ensure city and country labels update immediately when their lists change
    useEffect(() => {
      if (worldInstance.current) {
        worldInstance.current.updateData({
          clubList: data ?? [],
          cityList,
          countryList,
        });
      }
    }, [cityList, countryList]);
    // This div is the container where your Three.js canvas will be placed.
    // It will be styled to be in the background.
    return <div id="earth-canvas" ref={mountRef} />;
  }
);

export default WorldComponent;
