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
  MathUtils,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// interfaces
import { IWord } from '../interfaces/IWord';

import { Basic } from './Basic';
import Sizes from '../Utils/Sizes';
import { Resources } from './Resources';

// earth
import Earth from './Earth';
import { lon2xyz } from '../Utils/common';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import gsap from 'gsap';
import { ComboboxOption } from 'src/components';
import { DataType } from 'src/lib/usePublicClubs';
import { lockClub } from '../../components/ClubInfo';
import lockClubImage from '../../../static/images/lock-club.png';

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
  public cityList: ComboboxOption[];
  public countryList: ComboboxOption[];
  private cachedData: {
    clubList: DataType[];
    cityList: ComboboxOption[];
    countryList: ComboboxOption[];
  } | null = null;
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
    this.cityList = option.cityList;
    this.countryList = option.countryList;

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(
      this.renderer.domElement.clientWidth,
      this.renderer.domElement.clientHeight
    );
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none'; // Let clicks pass through to the canvas
    this.option.dom.appendChild(this.labelRenderer.domElement);

    this.tooltipElement = document.getElementById('tooltip');

    const canvas = this.renderer.domElement;

    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;
    // Add the event listener for mouse movement
    window.addEventListener('mousemove', this.onMarkerHover.bind(this));

    if (isTouchDevice) {
      canvas.addEventListener('touchstart', this.onMarkerHover.bind(this));
      canvas.addEventListener('touchmove', this.onMarkerHover.bind(this));
      canvas.addEventListener('touchend', this.hideTooltip.bind(this)); // Separate hide method
    } else {
      canvas.addEventListener('mousemove', this.onMarkerHover.bind(this));
      canvas.addEventListener('mouseleave', this.hideTooltip.bind(this));
    }

    this.sizes = new Sizes({ dom: option.dom });

    this.sizes.$on('resize', () => {
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
      this.controls.addEventListener('change', this.handleZoom.bind(this));

      if (this.cachedData) {
        // If so, use the cached data to create the markers immediately.
        await this.earth.createMarkupPointsAndLabels(
          this.cachedData?.clubList,
          this.cachedData?.cityList
        );
        this.earth.createCountryLabels(this.cachedData?.countryList);
        // Clear the cache so it's not used again.
        this.cachedData = null;
      }

      if (this.option.onLoaded) {
        this.option.onLoaded();
      }

      this.handleZoom();
      // 开始渲染
      this.render();
    });

    // ✨ SETUP RAYCASTER
    this.raycaster = new Raycaster();
    this.mouse = new Vector2();
    window.addEventListener('click', this.onPointClick.bind(this)); // Use 'window' for global clicks
  }

  private hideTooltip() {
    if (this.tooltipElement && this.currentlyHovered) {
      this.tooltipElement.classList.add('hidden');
      this.currentlyHovered = null;
    }
  }

  // --- ADD THIS NEW METHOD TO CLEAR MARKERS ---
  public clearMarkers() {
    if (this.earth) {
      this.earth.clearMarkers(); // We will add this method to the Earth class
    }
  }

  // --- ADD THIS NEW METHOD TO UPDATE DATA ---
  public async updateData(newData: {
    clubList: DataType[];
    cityList: ComboboxOption[];
    countryList: ComboboxOption[];
  }) {
    if (this.earth) {
      // Re-create the markup points with the new data
      await this.earth.createMarkupPointsAndLabels(
        newData?.clubList,
        newData?.cityList
      );
      this.earth.createCountryLabels(newData?.countryList);
      this.handleZoom();
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
    const cameraDistance = this.camera.position.length();
    const showCities = cameraDistance < this.cityThreshold;

    const cameraDirection = new Vector3();
    this.camera.getWorldDirection(cameraDirection);

    this.earth.cityLabels.forEach((label) => {
      // موقعیت لیبل روی کره
      const labelPosition = new Vector3();
      labelPosition.setFromMatrixPosition(label.matrixWorld);

      // بردار از مرکز کره به لیبل
      const normal = labelPosition.clone().normalize();

      // بردار از لیبل به دوربین
      const toCamera = this.camera.position
        .clone()
        .sub(labelPosition)
        .normalize();

      // ضرب داخلی -> اگه منفی باشه یعنی پشت کره‌ست
      const isInFront = normal.dot(toCamera) > 0;

      const isVisible = showCities && isInFront;

      label.visible = isVisible;
      label.element.style.display = isVisible ? 'block' : 'none';
    });

    this.earth.continentLabels.forEach(
      (label) => (label.visible = showContinents)
    );
    this.earth.countryLabels.forEach(
      (label) => (label.visible = showCountries)
    );

    this.earth.cityGroup.children.forEach((child) => {
      if (child.name.startsWith('leader_line_')) {
        // پیدا کردن بر اساس نام
        child.visible = showCities; // فقط وقتی showCities true باشه نمایش بده
      }
    });

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
      if (child.name === 'city_marker') {
        // Find markers by the name we set in Step 1
        child.scale.set(newScale, newScale, newScale);
      }
    });
  }

  private onMarkerHover(event: MouseEvent | TouchEvent) {
    if (!this.tooltipElement || !this.earth) return;

    const width = Number(this.sizes.viewport.width);
    const height = Number(this.sizes.viewport.height);

    let clientX = 0;
    let clientY = 0;
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as MouseEvent).clientX;
      clientY = (event as MouseEvent).clientY;
    }

    this.mouse.x = (clientX / width) * 2 - 1;
    this.mouse.y = -(clientY / height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // ریشه‌هایی که برای ری‌کست چک می‌کنیم: اولویت با clubGroup، بعداً fallback به markupPoint
    const roots: THREE.Object3D[] = [];
    if ((this.earth as any).clubGroup)
      roots.push((this.earth as any).clubGroup);
    if (this.earth.markupPoint) roots.push(this.earth.markupPoint);

    const intersects = this.raycaster.intersectObjects(roots, true);

    let hit: THREE.Object3D | null = null;
    if (intersects.length > 0) {
      let obj = intersects[0].object as THREE.Object3D;

      // تا ریشه‌ی ستون باشگاه بالا می‌رویم
      while (
        obj &&
        obj.parent &&
        !(
          obj.userData?.type === 'Club' ||
          obj.name === 'club_pillar' ||
          obj.name === 'light_pillar'
        )
      ) {
        obj = obj.parent;
      }

      if (
        obj.userData?.type === 'Club' ||
        obj.name === 'club_pillar' ||
        obj.name === 'light_pillar'
      ) {
        hit = obj;
      }
    }

    if (hit) {
      document.body.style.cursor = 'pointer';
      if (this.currentlyHovered !== hit) {
        this.currentlyHovered = hit;

        // اگر باشگاه قفل باشه، عکس نشون بده
        if (hit.userData?.data?.lockStatus === lockClub.lock) {
          this.tooltipElement.innerHTML = `
          <div class="flex flex-col gap-1 items-center justify-center">
          <img src="${lockClubImage}" alt="Locked" class="w-10 h-10 object-cover rounded-full" />
          <span>Locked</span>
          </div>
          `;
        } else {
          const labelText = hit.userData?.data?.reImaginedName || 'Club';
          this.tooltipElement.textContent = labelText;
        }

        this.tooltipElement.classList.remove('hidden');
      }
      this.tooltipElement.style.left = `${clientX}px`;
      this.tooltipElement.style.top = `${clientY - 60}px`;
    } else {
      document.body.style.cursor = 'default';

      this.hideTooltip();
    }
  }

  public rotateToCoordinates(lat: number, lon: number) {
    if (!this.earth) return;

    // حتماً محور چرخش OrbitControls روی مرکز زمین باشد
    // (اگر pan فعال بوده، target ممکن است جابجا شده باشد)
    this.controls.target.set(0, 0, 0);

    // آزیماس فعلی دوربین (theta در Spherical سه‌جی‌اس، از محور +Z و حول +Y)
    const camAz = this.controls.getAzimuthalAngle();

    // 1) بردار جهت نقطه روی کره را در دستگاه محلی زمین بسازید
    // حتماً ترتیب آرگومان‌ها دقیقاً مثل جایی که مارکرها ساخته می‌شوند باشد
    // (بسته به امضای lon2xyz در پروژه‌ی شما)
    const localDir = lon2xyz(1, lon, lat).normalize(); // radius=1 کافی‌ست (فقط جهت مهم است)

    // 2) به دستگاه جهانی (با درنظر گرفتن چرخش فعلی earthGroup) ببریم
    const worldDir = localDir
      .clone()
      .applyQuaternion(this.earth.earthGroup.quaternion);

    // 3) آزیماس و پولارِ همین نقطه را حساب کنیم
    const thetaPoint = Math.atan2(worldDir.x, worldDir.z); // آزیماس حول محور Y
    const yClamped = Math.max(-1, Math.min(1, worldDir.y));
    const phiPoint = Math.acos(yClamped); // پولار از +Y

    const pitchTilt = MathUtils.degToRad(4); // - یعنی کمی از بالا نگاه کند (مایل‌تر شود)

    // 4) به اندازه‌ای کره را حول Y بچرخانیم که آزیماس نقطه = آزیماس دوربین شود
    const currentY = this.earth.earthGroup.rotation.y;
    let deltaYaw = camAz - thetaPoint;

    // نرمال‌سازی به کوتاه‌ترین مسیر [-PI, PI]
    deltaYaw = ((deltaYaw + Math.PI) % (2 * Math.PI)) - Math.PI;
    const targetY = currentY + deltaYaw;

    const clampPhi = (phi: number) =>
      Math.min(Math.max(phi, 0.2), Math.PI - 0.2);

    // 5) انیمیشن
    const state = {
      y: currentY,
      phi: this.controls.getPolarAngle(),
      d: this.controls.getDistance(),
    };

    this.controls.enabled = false;

    gsap.to(state, {
      y: targetY,
      phi: clampPhi(phiPoint + pitchTilt), // دوربین را به عرض جغرافیایی نقطه می‌بریم
      d: 80, // فاصله دلخواه
      duration: 2.0,
      ease: 'power3.inOut',
      onUpdate: () => {
        this.earth.earthGroup.rotation.y = state.y;
        // آزیماس دوربین را ثابت نگه می‌داریم، فقط φ و فاصله را انیمیت می‌کنیم
        this.camera.position.setFromSphericalCoords(state.d, state.phi, camAz);
        this.controls.update();
        this.handleZoom();
      },
      onComplete: () => {
        this.controls.enabled = true;
        this.handleZoom();
      },
    });
  }

  private onPointClick(event: MouseEvent) {
    if (!this.earth) return;

    this.mouse.x = (event.clientX / this.sizes.viewport.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.sizes.viewport.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    // مثل hover: روی کل گروه‌ها تست می‌کنیم
    const roots: THREE.Object3D[] = [];
    if ((this.earth as any).clubGroup)
      roots.push((this.earth as any).clubGroup);
    if (this.earth.markupPoint) roots.push(this.earth.markupPoint);

    const intersects = this.raycaster.intersectObjects(roots, true);

    if (intersects.length > 0) {
      let obj = intersects[0].object as THREE.Object3D;

      // برو بالا تا برسی به pillar
      while (
        obj &&
        obj.parent &&
        !(
          obj.userData?.type === 'Club' ||
          obj.name === 'club_pillar' ||
          obj.name === 'light_pillar'
        )
      ) {
        obj = obj.parent;
      }

      if (
        obj.userData?.type === 'Club' ||
        obj.name === 'club_pillar' ||
        obj.name === 'light_pillar'
      ) {
        // 🔥 اینجا می‌تونی مثل قبل دیتا رو پاس بدی
        const { data } = obj.userData;
        if (this.option.onPointClick) {
          this.option.onPointClick(data);
        }
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
      cityList: this.cityList,
      countryList: this.countryList,
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
