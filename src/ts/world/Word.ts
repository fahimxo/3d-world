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
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// interfaces
import { IWord } from "../interfaces/IWord";

import { Basic } from "./Basic";
import Sizes from "../Utils/Sizes";
import { Resources } from "./Resources";

// earth
import Earth from "./Earth";
import Data from "./Data";
import { lon2xyz } from "../Utils/common";
import { DataType } from "src/app";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

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
  public data: DataType;
  public labelRenderer: CSS2DRenderer;

  // 👉 ADD THESE NEW PROPERTIES
  private detailedTexture: THREE.Texture;
  private originalTexture: THREE.Texture;
  private isZoomedIn = false;
  private readonly zoomThreshold: number = 115;

  private readonly continentThreshold: number = 120;
  // بین این دو فاصله -> کشورها
  private readonly cityThreshold: number = 95;
  // از این فاصله نزدیکتر -> شهرها

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

      this.handleZoom();
      // 开始渲染
      this.render();
    });

    // ✨ SETUP RAYCASTER
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    window.addEventListener("click", this.onPointClick.bind(this)); // Use 'window' for global clicks
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
  }

  public rotateToCoordinates(lat: number, lon: number) {
    // 1. Convert Lat/Lon to a 3D vector on the globe's surface
    const targetPosition = lon2xyz(this.earth.options.earth.radius, lon, lat);
    const targetVector = new Vector3(
      targetPosition.x,
      targetPosition.y,
      targetPosition.z
    ).normalize();

    // 2. Define the "camera-facing" direction (typically the positive Z-axis)
    const cameraFacingVector = new Vector3(0, 0, 1);

    // 3. Calculate the target rotation (Quaternion)
    // This quaternion represents the rotation needed to make the targetVector face the camera.
    const targetQuaternion = new Quaternion();
    targetQuaternion.setFromUnitVectors(targetVector, cameraFacingVector);

    // 4. Animate the Earth group's rotation using GSAP
    gsap.to(this.earth.earthGroup.quaternion, {
      x: targetQuaternion.x,
      y: targetQuaternion.y,
      z: targetQuaternion.z,
      w: targetQuaternion.w,
      duration: 2.5, // Animation duration in seconds
      ease: "power3.inOut",
      onStart: () => {
        // Disable controls during animation to prevent user interference
        this.controls.enabled = false;
      },
      onComplete: () => {
        // Re-enable controls when the animation finishes
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

      console.log(`You clicked on ${city}!`, data);

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
    this.earth && this.earth.render();
  }
}
