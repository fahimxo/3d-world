import {
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
  Raycaster, // 👈 Import Raycaster
  Vector2,
  Vector3,
  Quaternion,
  Euler,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// interfaces
import { IWord } from "../interfaces/IWord";

import { Basic } from "./Basic";
import Sizes from "../Utils/Sizes";
import { Resources } from "./Resources";

// earth
import Earth from "./Earth";
import { lon2xyz } from "../Utils/common";
import { DataType } from "src/app";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import gsap from "gsap";

export default class World {
  public basic: Basic;
  public scene: Scene;
  public camera: PerspectiveCamera;
  public renderer: WebGLRenderer;
  public controls: OrbitControls;
  public sizes: Sizes;
  public material: ShaderMaterial | MeshBasicMaterial;
  public resources: Resources;
  public option: IWord;
  public earth: Earth;
  public raycaster: Raycaster; // 👈 Add raycaster property
  public mouse: Vector2; // 👈 Add mouse vector property
  public data: DataType[];
  private cachedData: DataType[] | null = null;
  public labelRenderer: CSS2DRenderer;
  private tooltipElement: HTMLElement | null;
  private currentlyHovered: THREE.Object3D | null = null;

  // 👉 ADD THESE NEW PROPERTIES
  private detailedTexture: THREE.Texture;
  private originalTexture: THREE.Texture;
  private isZoomedIn = false;
  private readonly zoomThreshold: number = 115;

  private readonly continentThreshold: number = 120;
  // بین این دو فاصله -> کشورها
  private readonly cityThreshold: number = 95;
  // از این فاصله نزدیکتر -> شهرها

  private readonly markerBaseScale: number = 0.6; // مقیاس پایه و عادی مارکر
  private readonly markerMinScale: number = 0.2; // کوچک‌ترین مقیاسی که مارکر می‌تواند داشته باشد
  private readonly zoomForMinScale: number = 60; // فاصله‌ای که در آن مارکر به کوچک‌ترین اندازه می‌رسد

  constructor(option: IWord) {
    /**
     * 加载资源
     */
    this.option = option;

    this.basic = new Basic(option.dom);
    this.scene = this.basic.scene;
    this.renderer = this.basic.renderer;
    this.controls = this.basic.controls;
    this.camera = this.basic.camera;
    this.data = option.data;

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(
      this.renderer.domElement.clientWidth,
      this.renderer.domElement.clientHeight
    );
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0px";
    this.labelRenderer.domElement.style.pointerEvents = "none"; // Let clicks pass through to the canvas
    this.option.dom.appendChild(this.labelRenderer.domElement);

    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    window.addEventListener("click", this.onPointClick.bind(this));

    this.tooltipElement = document.getElementById("tooltip");
    // Add the event listener for mouse movement
    window.addEventListener("mousemove", this.onMarkerHover.bind(this));

    this.sizes = new Sizes({ dom: option.dom });

    this.sizes.$on("resize", () => {
      const width = Number(this.sizes.viewport.width);
      const height = Number(this.sizes.viewport.height);

      // Update WebGL Renderer
      this.renderer.setSize(width, height);

      // Update CSS2D Renderer
      this.labelRenderer.setSize(width, height);

      // Update Camera
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    });

    this.resources = new Resources(async () => {
      await this.createEarth();

      // Store the textures for later use
      this.originalTexture = this.resources.textures.earth; // Correct name from your file
      this.detailedTexture = this.resources.textures.earthDetailed; // The name you just added

      // Add the event listener for zoom changes
      this.controls.addEventListener("change", this.handleZoom.bind(this));

      if (this.cachedData) {
        // If so, use the cached data to create the markers immediately.
        await this.earth.createMarkupPointsAndLabels(this.cachedData);
        // Clear the cache so it's not used again.
        this.cachedData = null;
      }

      this.handleZoom();
      // 开始渲染
      this.render();
    });

    // ✨ SETUP RAYCASTER
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    window.addEventListener("click", this.onPointClick.bind(this)); // Use 'window' for global clicks
  }

  // --- ADD THIS NEW METHOD TO CLEAR MARKERS ---
  public clearMarkers() {
    if (this.earth) {
      this.earth.clearMarkers(); // We will add this method to the Earth class
    }
  }

  // --- ADD THIS NEW METHOD TO UPDATE DATA ---
  public async updateData(newData: DataType[]) {
    if (this.earth) {
      // Re-create the markup points with the new data
      await this.earth.createMarkupPointsAndLabels(newData);
    } else {
      this.cachedData = newData;
    }
  }

  private handleZoom() {
    const distance = this.controls.getDistance();

    // اطمینان از اینکه تمام لیبل‌ها بارگذاری شده‌اند
    if (
      !this.earth ||
      !this.earth.cityLabels ||
      !this.earth.continentLabels ||
      !this.earth.countryLabels
    ) {
      return;
    }

    // --- منطق اصلی نمایش لیبل‌ها ---
    const showContinents = distance > this.continentThreshold;
    const showCountries =
      distance <= this.continentThreshold && distance > this.cityThreshold;
    const showCities = distance <= this.cityThreshold;

    this.earth.continentLabels.forEach(
      (label) => (label.visible = showContinents)
    );
    this.earth.countryLabels.forEach(
      (label) => (label.visible = showCountries)
    );
    this.earth.cityLabels.forEach((label) => (label.visible = showCities));

    // --- منطق تعویض تکسچر زمین (برای زوم بالا) ---
    const shouldBeZoomedIn = showCountries || showCities;

    if (shouldBeZoomedIn && !this.isZoomedIn) {
      this.isZoomedIn = true;
      this.earth.earth.material.uniforms.map.value = this.detailedTexture;
    } else if (!shouldBeZoomedIn && this.isZoomedIn) {
      this.isZoomedIn = false;
      this.earth.earth.material.uniforms.map.value = this.originalTexture;
    }

    let newScale = this.markerBaseScale;

    // Only apply dynamic scaling if we are in the city view
    if (showCountries || showCities) {
      // Calculate the zoom progress (0 to 1) within the city zoom range
      const range = this.cityThreshold - this.zoomForMinScale;
      const progress = (this.cityThreshold - distance) / range;
      const clampedProgress = Math.max(0, Math.min(1, progress)); // Clamp between 0 and 1

      // Interpolate between the base scale and the minimum scale
      newScale =
        this.markerBaseScale +
        (this.markerMinScale - this.markerBaseScale) * clampedProgress;
    }

    // Apply the new scale to all markers
    this.earth.markupPoint.children.forEach((child) => {
      if (child.name === "city_marker") {
        // Find markers by the name we set in Step 1
        child.scale.set(newScale, newScale, newScale);
      }
    });
  }

  private onMarkerHover(event: MouseEvent) {
    if (!this.tooltipElement || !this.earth?.markupPoint) {
      return;
    }

    this.mouse.x = (event.clientX / this.sizes.viewport.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.sizes.viewport.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(
      [this.earth.markupPoint],
      true
    );

    let hoveredMarkerGroup = null;
    if (intersects.length > 0) {
      let intersectedObject = intersects[0].object;
      while (
        intersectedObject.parent &&
        intersectedObject.name !== "light_pillar"
      ) {
        intersectedObject = intersectedObject.parent;
      }
      if (intersectedObject.name === "light_pillar") {
        hoveredMarkerGroup = intersectedObject;
      }
    }

    if (hoveredMarkerGroup) {
      if (this.currentlyHovered !== hoveredMarkerGroup) {
        this.currentlyHovered = hoveredMarkerGroup;
        const cityName = this.currentlyHovered.userData.city;
        this.tooltipElement.textContent = cityName;

        // --- UPDATE THIS ---
        // Show the tooltip by removing the 'hidden' class
        this.tooltipElement.classList.remove("hidden");
      }

      // Position update remains the same
      this.tooltipElement.style.left = `${event.clientX}px`;
      this.tooltipElement.style.top = `${event.clientY - 60}px`;
    } else {
      if (this.currentlyHovered) {
        // --- UPDATE THIS ---
        // Hide the tooltip by adding the 'hidden' class
        this.tooltipElement.classList.add("hidden");
        this.currentlyHovered = null;
      }
    }
  }

  public rotateToCoordinates(lat: number, lon: number) {
    // 1. Get the camera's current horizontal angle (azimuth).
    // We want the camera to stay at this horizontal angle and the globe to rotate towards it.
    const currentCameraAzimuth = this.controls.getAzimuthalAngle();

    // 2. Define the target state for the animation
    const targetState = {
      // Corrected Logic: The globe's target is the longitude's angle MINUS the camera's angle.
      globeY: lon * (Math.PI / 180) - currentCameraAzimuth,

      // Vertical tilt and zoom calculations remain the same.
      camPolar: Math.PI / 2 - lat * (Math.PI / 180),
      camDistance: 80,
    };

    // 3. Create a proxy object with the current values to animate from.
    const animationProxy = {
      globeY: this.earth.earthGroup.rotation.y,
      camPolar: this.controls.getPolarAngle(),
      camDistance: this.controls.getDistance(),
    };

    // 4. Handle the shortest rotation path for the globe.
    // This ensures the globe always spins in the shortest direction.
    const rotationDifference = targetState.globeY - animationProxy.globeY;
    const shortestAngle =
      ((rotationDifference + Math.PI) % (2 * Math.PI)) - Math.PI;
    const finalTargetY = animationProxy.globeY + shortestAngle;

    // 5. Use GSAP to animate from the current state to the target state.
    gsap.to(animationProxy, {
      globeY: finalTargetY,
      camPolar: targetState.camPolar,
      camDistance: targetState.camDistance,
      duration: 2.5,
      ease: "power3.inOut",

      onStart: () => {
        this.controls.enabled = false;
      },

      // onUpdate is called on every frame of the animation
      onUpdate: () => {
        // Apply the animated horizontal rotation to the globe
        this.earth.earthGroup.rotation.y = animationProxy.globeY;

        // Apply the animated vertical tilt and zoom to the camera.
        // The camera's horizontal angle (azimuth) remains UNCHANGED.
        this.camera.position.setFromSphericalCoords(
          animationProxy.camDistance,
          animationProxy.camPolar,
          currentCameraAzimuth
        );

        // We must call controls.update() to apply the camera changes.
        this.controls.update();
      },

      onComplete: () => {
        this.controls.enabled = true;
      },
    });
  }

  private onPointClick(event: MouseEvent) {
    // If the earth hasn't been created yet, do nothing
    if (!this.earth || !this.earth.clickablePoints) {
      return;
    }

    // 1. Calculate mouse position in normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / this.sizes.viewport.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.sizes.viewport.height) * 2 + 1;

    // 2. Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // 3. Get a list of objects the ray intersects
    const intersects = this.raycaster.intersectObjects(
      this.earth.clickablePoints
    );

    // 4. Check if we hit any of our markup points
    if (intersects.length > 0) {
      // The first object in the array is the closest one
      const clickedObject = intersects[0].object;

      // Access the data you stored earlier!
      const { city, data } = clickedObject.userData;

      // 👉 Here you can trigger your React state update
      // For example, by calling a callback function passed in the constructor
      if (this.option.onPointClick) {
        this.option.onPointClick(data);
      } else {
        // Fallback: Vanilla JS modal trigger
        const modal = document.getElementById("cityModal") as HTMLElement;
        const cityName = document.getElementById("cityName") as HTMLElement;
        const cityData = document.getElementById("cityData") as HTMLElement;

        cityName.innerText = city;
        cityData.innerText = JSON.stringify(data, null, 2);

        modal.style.display = "block";

        const closeBtn = modal.querySelector(".close-button") as HTMLElement;
        closeBtn.onclick = () => (modal.style.display = "none");

        // Close when clicking outside modal
        window.onclick = (event: MouseEvent) => {
          if (event.target === modal) {
            modal.style.display = "none";
          }
        };
      }
    }
  }

  async createEarth() {
    // 资源加载完成，开始制作地球，注释在new Earth()类型里面
    // ...existing code...
    // ...existing code...
    this.earth = new Earth({
      // data: Data,
      data: this.data,
      dom: this.option.dom,
      textures: this.resources.textures,
      earth: {
        radius: 50,
        rotateSpeed: 0.0,
        isRotation: true,
      },

      // satellite: {
      //   show: false,
      //   number: 0,
      //   rotateSpeed: 0,
      //   size: 0.1,
      // }, // Add this line
      // flyLine: {
      //   color: 0x3892ff,
      //   speed: 0.002,
      //   flyLineColor: 0x3892ff,
      // }, // Add this line
      punctuation: {
        circleColor: 0x3892ff,
        lightColumn: {
          startColor: 0xe4007f,
          endColor: 0xffffff,
        },
      },
    });
    // ...existing code...
    // ...existing code...

    this.scene.add(this.earth.group);

    await this.earth.init();

    // 隐藏dom
    // const loading = document.querySelector("#loading");
    // loading.classList.add("out");
  }

  /**
   * 渲染函数
   */
  public render() {
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera); // Renders the 3D scene
    this.labelRenderer.render(this.scene, this.camera);
    this.controls && this.controls.update();
    this.earth && this.earth.render(this.camera);
  }
}
