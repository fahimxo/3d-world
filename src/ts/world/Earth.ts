import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  Object3D,
  Points,
  PointsMaterial,
  ShaderMaterial,
  SphereBufferGeometry,
  Sprite,
  SpriteMaterial,
  Texture,
  TextureLoader,
  Vector3,
  CanvasTexture,
  ConeGeometry,
  SphereGeometry,
  Shape,
  Path,
  ExtrudeGeometry,
  MeshStandardMaterial,
  PerspectiveCamera,
  LineBasicMaterial,
  Line,
} from 'three';

import html2canvas from 'html2canvas';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import earthVertex from '../../shaders/earth/vertex.vs';
import earthFragment from '../../shaders/earth/fragment.fs';
import {
  createAnimateLine,
  createLightPillar,
  createMarker,
  createPointMesh,
  createWaveMesh,
  getCirclePoints,
  lon2xyz,
} from '../Utils/common';
import gsap from 'gsap';
import { flyArc } from '../Utils/arc';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { ComboboxOption } from 'src/components';
import { DataType } from 'src/lib/usePublicClubs';
import { lockClub } from '../../components/ClubInfo';

export type punctuation = {
  circleColor: number;
  lightColumn: {
    startColor: number; // 起点颜色
    endColor: number; // 终点颜色
  };
};

export interface CityData {
  city: string;
  latitude: number;
  longitude: number;
  // ... هر فیلد دیگه‌ای که بعداً لازم داری
}

type options = {
  data: DataType[];
  cityList: ComboboxOption[];
  countryList: ComboboxOption[];
  dom: HTMLElement;
  textures: Record<string, Texture>; // 贴图
  earth: {
    radius: number; // 地球半径
    rotateSpeed: number; // 地球旋转速度
    isRotation: boolean; // 地球组是否自转
  };
  // satellite: {
  //   show: boolean; // 是否显示卫星
  //   rotateSpeed: number; // 旋转速度
  //   size: number; // 卫星大小
  //   number: number; // 一个圆环几个球
  // };
  punctuation: punctuation;
  // flyLine: {
  //   color: number; // 飞线的颜色
  //   speed: number; // 飞机拖尾线速度
  //   flyLineColor: number; // 飞行线的颜色
  // };
};
type uniforms = {
  glowColor: { value: Color };
  scale: { type: string; value: number };
  bias: { type: string; value: number };
  power: { type: string; value: number };
  time: { type: string; value: any };
  isHover: { value: boolean };
  map: { value: Texture };
};

export default class earth {
  public group: Group;
  public earthGroup: Group;

  public around: BufferGeometry;
  public aroundPoints: Points<BufferGeometry, PointsMaterial>;

  public options: options;
  public uniforms: uniforms;
  public timeValue: number;

  public earth: Mesh<SphereBufferGeometry, ShaderMaterial>;
  public punctuationMaterial: MeshBasicMaterial;
  public markupPoint: Group;
  public waveMeshArr: Object3D[];

  public circleLineList: any[];
  public circleList: any[];
  public x: number;
  public n: number;
  public isRotation: boolean;
  public flyLineArcGroup: Group;
  public clickablePoints: THREE.Mesh[] = [];
  public data: DataType[];
  public cityList: ComboboxOption[];
  public countryList: ComboboxOption[];
  public cityLabels: CSS2DObject[] = [];
  public continentLabels: Sprite[] = [];
  public countryLabels: Sprite[] = [];

  public cityGroup: THREE.Group;
  public clubGroup: THREE.Group;

  constructor(options: options) {
    this.options = options;
    this.data = options.data;
    this.cityList = options.cityList;
    this.countryList = options.countryList;

    this.group = new Group();
    this.group.name = 'group';
    this.group.scale.set(0, 0, 0);
    this.earthGroup = new Group();
    this.group.add(this.earthGroup);
    this.earthGroup.name = 'EarthGroup';

    // 标注点效果
    this.markupPoint = new Group();
    this.markupPoint.name = 'markupPoint';
    this.waveMeshArr = [];

    this.cityGroup = new Group();
    this.cityGroup.name = 'city_group';

    this.clubGroup = new Group();
    this.clubGroup.name = 'club_group';

    this.earthGroup.add(this.cityGroup);
    this.earthGroup.add(this.clubGroup);

    // 卫星和标签
    this.circleLineList = [];
    this.circleList = [];
    this.x = 0;
    this.n = 0;

    // 地球自转
    this.isRotation = this.options.earth.isRotation;

    // 扫光动画 shader
    this.timeValue = 100;
    this.uniforms = {
      glowColor: {
        value: new Color(0x0cd1eb),
      },
      scale: {
        type: 'f',
        value: -1.0,
      },
      bias: {
        type: 'f',
        value: 1.0,
      },
      power: {
        type: 'f',
        value: 3.3,
      },
      time: {
        type: 'f',
        value: this.timeValue,
      },
      isHover: {
        value: false,
      },
      map: {
        value: null,
      },
    };
  }

  async init(): Promise<void> {
    return new Promise(async (resolve) => {
      this.createEarth(); // 创建地球
      this.createStars(); // 添加星星
      this.createEarthGlow(); // 创建地球辉光
      this.createEarthAperture(); // 创建地球的大气层
      await this.createMarkupPointsAndLabels(this.data, this.cityList); // 创建柱状点位
      this.createSpriteLabel(); // 创建标签
      this.createCountryLabels(this.countryList);
      // this.createAnimateCircle(); // 创建环绕卫星
      // this.createFlyLine(); // 创建飞线

      this.show();
      resolve();
    });
  }

  private createHTMLLabel(text: string): CSS2DObject {
    const div = document.createElement('div');
    // Style the div using Tailwind CSS classes
    div.className =
      'text-primary-200 text-xs font-bold bg-secondary-700 px-2 py-1 rounded-md shadow-lg pointer-events-none';
    div.textContent = text;

    const label = new CSS2DObject(div);
    return label;
  }

  createEarth() {
    const earth_geometry = new SphereBufferGeometry(
      this.options.earth.radius,
      50,
      50
    );

    const earth_border = new SphereBufferGeometry(
      this.options.earth.radius + 10,
      60,
      60
    );

    const pointMaterial = new PointsMaterial({
      color: 0x81ffff, //设置颜色，默认 0xFFFFFF
      transparent: true,
      sizeAttenuation: true,
      opacity: 0.1,
      vertexColors: false, //定义材料是否使用顶点颜色，默认false ---如果该选项设置为true，则color属性失效
      size: 0.01, //定义粒子的大小。默认为1.0
    });
    const points = new Points(earth_border, pointMaterial); //将模型添加到场景

    this.earthGroup.add(points);

    this.uniforms.map.value = this.options.textures.earth;

    const earth_material = new ShaderMaterial({
      // wireframe:true, // 显示模型线条
      uniforms: this.uniforms,
      vertexShader: earthVertex,
      fragmentShader: earthFragment,
    });

    earth_material.needsUpdate = true;
    this.earth = new Mesh(earth_geometry, earth_material);
    this.earth.name = 'earth';
    this.earthGroup.add(this.earth);
  }

  createStars() {
    const vertices = [];
    const colors = [];
    for (let i = 0; i < 500; i++) {
      const vertex = new Vector3();
      vertex.x = 800 * Math.random() - 300;
      vertex.y = 800 * Math.random() - 300;
      vertex.z = 800 * Math.random() - 300;
      vertices.push(vertex.x, vertex.y, vertex.z);
      colors.push(new Color(1, 1, 1));
    }

    // 星空效果
    this.around = new BufferGeometry();
    this.around.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(vertices), 3)
    );
    this.around.setAttribute(
      'color',
      new BufferAttribute(new Float32Array(colors), 3)
    );

    const aroundMaterial = new PointsMaterial({
      size: 2,
      sizeAttenuation: true, // 尺寸衰减
      color: 0x4d76cf,
      transparent: true,
      opacity: 1,
      map: this.options.textures.gradient,
    });

    this.aroundPoints = new Points(this.around, aroundMaterial);
    this.aroundPoints.name = '星空';
    this.aroundPoints.scale.set(1, 1, 1);
    this.group.add(this.aroundPoints);
  }

  createEarthGlow() {
    const R = this.options.earth.radius; //地球半径

    // TextureLoader创建一个纹理加载器对象，可以加载图片作为纹理贴图
    const texture = this.options.textures.glow; // 加载纹理贴图

    // 创建精灵材质对象SpriteMaterial
    const spriteMaterial = new SpriteMaterial({
      map: texture, // 设置精灵纹理贴图
      color: 0x4390d1,
      transparent: true, //开启透明
      opacity: 0.7, // 可以通过透明度整体调节光圈
      depthWrite: false, //禁止写入深度缓冲区数据
    });

    // 创建表示地球光圈的精灵模型
    const sprite = new Sprite(spriteMaterial);
    sprite.scale.set(R * 3.0, R * 3.0, 1); //适当缩放精灵
    this.earthGroup.add(sprite);
  }

  createEarthAperture() {
    const vertexShader = [
      'varying vec3	vVertexWorldPosition;',
      'varying vec3	vVertexNormal;',
      'varying vec4	vFragColor;',
      'void main(){',
      '	vVertexNormal	= normalize(normalMatrix * normal);', //将法线转换到视图坐标系中
      '	vVertexWorldPosition	= (modelMatrix * vec4(position, 1.0)).xyz;', //将顶点转换到世界坐标系中
      '	// set gl_Position',
      '	gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      '}',
    ].join('\n');

    //大气层效果
    const AeroSphere = {
      uniforms: {
        coeficient: {
          type: 'f',
          value: 1.0,
        },
        power: {
          type: 'f',
          value: 3,
        },
        glowColor: {
          type: 'c',
          value: new Color(0x4390d1),
        },
      },
      vertexShader: vertexShader,
      fragmentShader: [
        'uniform vec3	glowColor;',
        'uniform float	coeficient;',
        'uniform float	power;',

        'varying vec3	vVertexNormal;',
        'varying vec3	vVertexWorldPosition;',

        'varying vec4	vFragColor;',

        'void main(){',
        '	vec3 worldCameraToVertex = vVertexWorldPosition - cameraPosition;', //世界坐标系中从相机位置到顶点位置的距离
        '	vec3 viewCameraToVertex	= (viewMatrix * vec4(worldCameraToVertex, 0.0)).xyz;', //视图坐标系中从相机位置到顶点位置的距离
        '	viewCameraToVertex= normalize(viewCameraToVertex);', //规一化
        '	float intensity	= pow(coeficient + dot(vVertexNormal, viewCameraToVertex), power);',
        '	gl_FragColor = vec4(glowColor, intensity);',
        '}',
      ].join('\n'),
    };
    //球体 辉光 大气层
    const material1 = new ShaderMaterial({
      uniforms: AeroSphere.uniforms,
      vertexShader: AeroSphere.vertexShader,
      fragmentShader: AeroSphere.fragmentShader,
      blending: NormalBlending,
      transparent: true,
      depthWrite: false,
    });
    const sphere = new SphereBufferGeometry(
      this.options.earth.radius + 0,
      50,
      50
    );
    const mesh = new Mesh(sphere, material1);
    this.earthGroup.add(mesh);
  }

  // async createMarkupPoint() {
  //   // Example city data
  //   const cities = [
  //     { name: "Tehran", E: 51.389, N: 35.689 }, // Longitude, Latitude
  //     { name: "London", E: -0.1276, N: 51.5074 },
  //     // Add more cities here
  //   ];

  //   cities.forEach((city) => {
  //     // Convert lon/lat to 3D position
  //     const pos = lon2xyz(this.options.earth.radius * 1.01, city.E, city.N);

  //     // Create a marker mesh (e.g., a small sphere)
  //     const marker = new Mesh(
  //       new SphereBufferGeometry(1, 16, 16),
  //       new MeshBasicMaterial({ color: 0xff0000 })
  //     );
  //     marker.position.set(pos.x, pos.y, pos.z);
  //     marker.name = city.name;

  //     this.earthGroup.add(marker);
  //   });
  // }

  createCustom3DMarker(color) {
    const markerGroup = new Group();

    // --- 1. Define the 2D shape of the marker ---
    const markerShape = new Shape();
    const width = 1.2; // Base width of the marker
    const height = 2; // Height from the bottom tip to the top of the circle
    const radius = width / 2;

    // Start at the bottom tip
    markerShape.moveTo(0, 0);
    // Draw the top arc
    markerShape.absarc(0, height - radius, radius, Math.PI, 0, true);
    // Close the shape by drawing a line back to the tip
    markerShape.lineTo(0, 0);

    // --- 2. Define the hole in the middle ---
    const holeRadius = radius * 0.77; // Adjust size of the hole
    const holePath = new Path();
    // Create a circular path for the hole
    holePath.absarc(0, height - radius, holeRadius, 0, Math.PI * 2, false);
    // Add the hole to the shape's definition
    markerShape.holes.push(holePath);

    // --- 3. Extrude the 2D shape to make it 3D ---
    const extrudeSettings = {
      steps: 1,
      depth: 0.75, // This controls the thickness of the marker
      bevelEnabled: true, // Beveling creates the nice rounded edges
      bevelThickness: 0.2,
      bevelSize: 0.2,
      bevelSegments: 5,
    };

    const geometry = new ExtrudeGeometry(markerShape, extrudeSettings);

    // --- 4. Create the material and mesh ---
    // Using MeshStandardMaterial will allow the marker to react to lights in your scene
    const material = new MeshBasicMaterial({
      color: new Color(color),
    });

    const mesh = new Mesh(geometry, material);
    markerGroup.add(mesh);

    // The shape is drawn on the XY plane, so we rotate it to stand up
    markerGroup.rotateX(Math.PI / 2);

    return markerGroup;
  }

  public clearMarkers() {
    // 1) DOM لیبل‌های قبلی را هم جدا کن تا چیزی در صفحه باقی نمونه
    this.cityLabels.forEach((lbl) => {
      if (lbl.element && lbl.element.parentNode) {
        lbl.element.parentNode.removeChild(lbl.element);
      }
    });

    // 2) گروه‌های گرافیکی را کامل خالی کن
    if (this.cityGroup) this.cityGroup.clear(); // 👈 مهم
    if (this.clubGroup) this.clubGroup.clear(); // 👈 مهم
    if (this.markupPoint) this.markupPoint.clear(); // برای کدهای legacy

    // 3) آرایه‌ها را ریست کن
    this.clickablePoints = [];
    this.cityLabels = [];
    this.data = [];
  }

  // 1) ساخت Light Pillar برای باشگاه‌ها
  public async createClubPillars(clubs: DataType[] = []) {
    const radius = this.options.earth.radius;

    this.clubGroup.clear();
    this.clickablePoints.length = 0;

    // --- ✨ بخش جدید برای جلوگیری از تداخل ---
    const cityClubCounts: { [cityName: string]: number } = {};
    const baseOffsetAngle = 0.5; // زاویه اولیه برای جابجایی (بر حسب درجه)
    // ------------------------------------

    await Promise.all(
      clubs.map(async (item) => {
        let lon = +item.longitude;
        let lat = +item.latitude;

        const color =
          item?.lockStatus === lockClub.unLock ? item?.pinColor : 0x525354;

        // --- ✨ منطق جابجایی (Offsetting Logic) ---
        const cityName = item.city;
        if (cityClubCounts[cityName]) {
          const clubIndex = cityClubCounts[cityName];
          // برای هر باشگاه اضافه در یک شهر، آن را در یک زاویه متفاوت قرار بده
          const angle = clubIndex * 45 * (Math.PI / 180); // هر باشگاه ۴۵ درجه بچرخد
          const offsetLat = baseOffsetAngle * Math.sin(angle);
          const offsetLon = baseOffsetAngle * Math.cos(angle);

          lat += offsetLat;
          lon += offsetLon;

          cityClubCounts[cityName]++;
        } else {
          cityClubCounts[cityName] = 1;
        }
        // ------------------------------------------

        // خود ستون نور
        const pillar = createLightPillar({
          radius,
          lon, // از lon و lat تغییر یافته استفاده کن
          lat,
          color,
          index: 0,
          textures: this.options.textures,
          punctuation: this.options.punctuation,
          data: item,
        });
        pillar.name = 'club_pillar';
        pillar.userData = { type: 'Club', city: item.city, data: item };

        this.clubGroup.add(pillar);

        // برای Raycast: یک مش کوچک نامرئی روی محل ستون می‌گذاریم
        const pick = new Mesh(
          new SphereGeometry(0.8, 10, 10),
          new MeshBasicMaterial({ visible: false })
        );
        const pickPos = lon2xyz(radius + 0.2, lon, lat); // از مختصات جدید استفاده کن
        pick.position.set(pickPos.x, pickPos.y, pickPos.z);
        pick.userData = pillar.userData; // همان دیتا
        pick.name = 'club_pick'; // صرفاً جهت دیباگ
        this.clubGroup.add(pick);
        this.clickablePoints.push(pick);
      })
    );
  }

  // تغییر جدید: تابع کمکی برای محاسبه فاصله جغرافیایی (Haversine formula)
  private haversine(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // شعاع زمین در کیلومتر
    const dlat = ((lat2 - lat1) * Math.PI) / 180;
    const dlon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dlat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // فاصله در کیلومتر
  }

  // 2) ساخت Point Mesh برای شهرها
  public async createCityPoints(cities: ComboboxOption[] = []) {
    const radius = this.options.earth.radius;
    const closeThreshold = 170; // آستانه فاصله نزدیک (کیلومتر)، تنظیم کنید

    // تغییر جدید: پیش‌پردازش برای پیدا کردن گروه‌های شهرهای نزدیک
    const cityGroups: { [key: string]: ComboboxOption[] } = {}; // گروه‌بندی بر اساس نزدیکی
    cities.forEach((city) => {
      let grouped = false;
      for (const groupKey in cityGroups) {
        const group = cityGroups[groupKey];
        const dist = this.haversine(
          +city.latitude,
          +city.longitude,
          +group[0].latitude,
          +group[0].longitude
        );
        if (dist < closeThreshold) {
          group.push(city);
          grouped = true;
          break;
        }
      }
      if (!grouped) {
        cityGroups[city.label || city.value] = [city]; // گروه جدید
      }
    });

    await Promise.all(
      cities.map(async (item) => {
        const lon = +item.longitude;
        const lat = +item.latitude;
        const color = 0xffa500;

        // تغییر جدید: پیدا کردن گروه این شهر و اعمال offset اگر گروه بزرگ باشه
        let offsetLon = 0;
        let offsetLat = 0;
        for (const groupKey in cityGroups) {
          const group = cityGroups[groupKey];
          if (group.includes(item) && group.length > 1) {
            // اگر گروه بیشتر از 1 شهر داره، offset اعمال کن
            const index = group.indexOf(item);
            const angle = (index / group.length) * 2 * Math.PI; // توزیع دایره‌ای
            let offsetDistance = 1 + (group.length - 1) * 0.5; // درجه offset، بسته به تعداد
            offsetDistance = Math.min(offsetDistance, 1.5); // حداکثر ۳ درجه
            offsetLon = offsetDistance * Math.cos(angle);
            offsetLat = offsetDistance * Math.sin(angle);
            break;
          }
        }

        // موقعیت اصلی نقطه شهر (بدون offset)
        const originalPos = lon2xyz(radius, lon, lat);

        // موقعیت جابجا شده برای لیبل
        const labelLon = lon + offsetLon;
        const labelLat = lat + offsetLat;
        const labelPos = lon2xyz(radius + 1, labelLon, labelLat);

        const pointMaterial = new MeshBasicMaterial({
          color,
          map: this.options.textures.label,
          transparent: true,
          depthWrite: false,
        });

        const cityPoint = createPointMesh({
          radius,
          lon,
          lat, // نقطه شهر بدون offset
          material: pointMaterial,
        });

        this.cityGroup.add(cityPoint);
        this.clickablePoints.push(cityPoint);

        // لیبل HTML
        const label = this.createHTMLLabel(item.value);
        label.visible = false; // همیشه可见، چون ثابت است
        label.position.set(labelPos.x, labelPos.y, labelPos.z);

        this.cityGroup.add(label);
        this.cityLabels.push(label);

        // تغییر جدید: اگر offset اعمال شده، leader line اضافه کن
        if (offsetLon !== 0 || offsetLat !== 0) {
          const lineGeometry = new BufferGeometry().setFromPoints([
            new Vector3(originalPos.x, originalPos.y, originalPos.z), // موقعیت اصلی شهر
            new Vector3(labelPos.x, labelPos.y, labelPos.z), // موقعیت لیبل
          ]);
          const lineMaterial = new LineBasicMaterial({
            color: 0xffffff,
            linewidth: 7,
          }); // خط سفید نازک
          const leaderLine = new Line(lineGeometry, lineMaterial);
          leaderLine.name = `leader_line_${item.value}`;
          this.cityGroup.add(leaderLine);
        }
      })
    );
  }

  async createMarkupPointsAndLabels(
    data: DataType[] = [],
    cityList: ComboboxOption[] = []
  ) {
    this.data = data ?? [];

    this.clearMarkers();

    await this.createClubPillars(data);

    await this.createCityPoints(cityList);

    // await Promise.all(
    //   data?.map(async (item) => {
    //     const radius = this.options.earth.radius;
    //     const lon = item.longitude; //经度
    //     const lat = item.latitude; //纬度
    //     const color = 0xffa500;

    //     const pointMaterial = new MeshBasicMaterial({
    //       color: color,
    //       map: this.options.textures.label,
    //       transparent: true, //使用背景透明的png贴图，注意开启透明计算
    //       depthWrite: false, //禁止写入深度缓冲区数据
    //     });

    //     const mesh = createPointMesh({
    //       radius,
    //       lon,
    //       lat,
    //       material: pointMaterial,
    //     }); //光柱底座矩形平面

    //     mesh.userData = { type: "MarkupPoint", city: item.city, data: item };

    //     this.markupPoint.add(mesh);
    //     this.clickablePoints.push(mesh); // Add to our special array

    //     // --- Create the 3D marker using the code function ---
    //     // const marker3D = this.createCustom3DMarker(color);

    //     // marker3D.name = "city_marker";
    //     // marker3D.userData = mesh.userData;

    //     // Position the marker with a bit of distance from the surface
    //     // const position = lon2xyz(
    //     //   this.options.earth.radius + 0.4,
    //     //   lon, lat
    //     // ); // The '+ 2' controls distance
    //     // marker3D.position.set(position.x, position.y, position.z);

    //     // Scale it down to an appropriate size
    //     // const scaleFactor = 0.5;
    //     // marker3D.scale.set(scaleFactor, scaleFactor, scaleFactor);

    //     // const surfaceNormal = new Vector3(
    //     //   position.x,
    //     //   position.y,
    //     //   position.z
    //     // ).normalize();
    //     // const markerUp = new Vector3(0, 1, 0);
    //     // marker3D.quaternion.setFromUnitVectors(markerUp, surfaceNormal);

    //     // const angleInDegrees = 10; // مارکر را ۴۵ درجه به جلو خم کن
    //     // const angleInRadians = angleInDegrees * (Math.PI / 180);
    //     // marker3D.rotateX(angleInRadians);
    //     // برای خم کردن به بغل می‌توانید از marker.rotateZ() استفاده کنید
    //     // marker3D.rotateZ(70 * (Math.PI / 180));

    //     // marker3D.rotateY(90 * (Math.PI / 180));
    //     // --- پایان اعمال زاویه ---

    //     // ۳. مقیاس مارکر را تنظیم کنید
    //     // marker3D.scale.set(0.7, 0.7, 0.7);

    //     // Orient it to point away from the Earth's center
    //     // marker3D.lookAt(0, 0, 0); // Points towards the center
    //     // marker3D.rotateX(Math.PI); // Flips it 180 degrees to point outwards

    //     // this.markupPoint.add(marker3D);

    //     // const textureLoader = new TextureLoader();
    //     // const markerTexture = textureLoader.load(
    //     //   "/static/images/earth/map-marker.webp"
    //     // );

    //     // const marker = createMarker({
    //     //   radius: radius,
    //     //   lon: lon, // Longitude for Hidden Hills, CA
    //     //   lat: lat, // Latitude for Hidden Hills, CA
    //     //   textures: { marker: markerTexture }, // Make sure this texture is white
    //     //   color: color, // Now you can set any color you want
    //     // });

    //     const LightPillar = createLightPillar({
    //       radius: this.options.earth.radius,
    //       lon,
    //       lat,
    //       color: color,
    //       index: 0,
    //       textures: this.options.textures,
    //       punctuation: this.options.punctuation,
    //       data: item,
    //     }); //光柱
    //     this.markupPoint.add(LightPillar);
    //     // const WaveMesh = createWaveMesh({
    //     //   radius,
    //     //   lon,
    //     //   lat,
    //     //   textures: this.options.textures,
    //     //   color: item.color,
    //     // }); //波动光圈
    //     // this.markupPoint.add(WaveMesh);
    //     // this.waveMeshArr.push(WaveMesh);

    //     // const label = this.createCityLabel(item.name);
    //     const fontSize = 12; // رزولوشن بالا برای کیفیت
    //     const scalingFactor = 0.05; // کوچک کردن برای اندازه مناسب در صحنه

    //     const label = this.createHTMLLabel(item.city);
    //     // const label = this.createTextSprite(
    //     //   item.name,
    //     //   fontSize,
    //     //   "#fff",
    //     //   scalingFactor
    //     // );
    //     label.visible = false;
    //     // Position the label slightly above the surface and offset to the side
    //     const labelPos = lon2xyz(radius + 1, lon, lat); // Adjust radius offset as needed
    //     label.position.set(labelPos.x, labelPos.y, labelPos.z);

    //     this.markupPoint.add(label);
    //     this.cityLabels.push(label);

    //     this.earthGroup.add(this.markupPoint);
    //   })
    // );
  }

  public createSpriteLabel() {
    const continents = [
      { name: 'Amerika Prime', E: -100, N: 45 },
      { name: 'Latina Terra', E: -60, N: -15 },
      { name: 'Afrika Nova', E: 20, N: 2 },
      { name: 'Eurovia', E: 15, N: 50 },
      { name: 'Rusino', E: 86, N: 52 },
      { name: 'Oceastria', E: 135, N: -25 },
      { name: 'Balkara', E: 22, N: 43 },
      { name: 'Nordika', E: 13, N: 65 },
      { name: 'Indora', E: 77, N: 23 },
      { name: 'Sinora', E: 138, N: 37 },
      { name: 'Araka', E: 27, N: 26 },
      { name: 'NeoBritannia', E: -4, N: 54 },
    ];

    const fontSize = 40; // Larger font for continents
    const color = '#FFFFFF'; // White color for continents
    const scalingFactor = 0.06;

    continents.forEach((continent) => {
      // Use the reusable helper function
      const sprite = this.createTextSprite(
        continent.name,
        fontSize,
        color,
        scalingFactor
      );

      // Position the label further out from the globe
      const pos = lon2xyz(
        this.options.earth.radius + 4,
        continent.E,
        continent.N
      );
      sprite.position.set(pos.x, pos.y, pos.z);

      // Make continent labels always visible
      sprite.visible = false;

      this.earthGroup.add(sprite);
      this.continentLabels.push(sprite);
    });
  }

  public createCountryLabels(countryList: ComboboxOption[]) {
    // const countries = [
    //   { name: 'United States', E: -100, N: 39 },
    //   { name: 'Canada', E: -95, N: 56 },
    //   { name: 'Brazil', E: -55, N: -10 },
    //   { name: 'Germany', E: 10, N: 51 },
    //   { name: 'Spain', E: -4, N: 40 },
    //   { name: 'United Kingdom', E: -2, N: 54 },
    //   { name: 'Russia', E: 90, N: 60 },
    //   { name: 'China', E: 104, N: 35 },
    //   { name: 'India', E: 78, N: 20 },
    //   { name: 'Japan', E: 138, N: 36 },
    //   { name: 'Egypt', E: 30, N: 27 },
    //   { name: 'South Africa', E: 24, N: -29 },
    // ];

    // استایل فونت برای کشورها (کمی بزرگتر از شهرها)
    const fontSize = 17;
    const color = '#FFFFFF';
    // const fontSize = 192;
    const scalingFactor = 0.05; // ضریب مقیاس مشابه
    countryList?.forEach((country) => {
      const sprite = this.createTextSprite(
        country?.label,
        fontSize,
        color,
        scalingFactor
      );
      const pos = lon2xyz(
        this.options.earth.radius + 3,
        country.longitude,
        country.latitude
      );
      sprite.position.set(pos.x, pos.y, pos.z);
      sprite.visible = false; // در ابتدا مخفی باشد
      this.earthGroup.add(sprite);

      // اضافه کردن به آرایه مخصوص کشورها
      this.countryLabels.push(sprite);
    });
  }

  private createTextSprite(
    text: string,
    fontSize: number,
    color: string,
    scalingFactor: number
  ): Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const fontFamily = 'Arial';

    context.font = `bolder ${fontSize}px ${fontFamily}`;
    const metrics = context.measureText(text);
    canvas.width = metrics.width;
    canvas.height = fontSize * 1.2;

    context.font = `bolder ${fontSize}px ${fontFamily}`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new CanvasTexture(canvas);
    const material = new SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });

    const sprite = new Sprite(material);

    // تغییر یافته: استفاده از scalingFactor ورودی
    const spriteWidth = canvas.width * scalingFactor;
    const spriteHeight = canvas.height * scalingFactor;
    sprite.scale.set(spriteWidth, spriteHeight, 1);

    return sprite;
  }

  private createCityLabel(text: string): Sprite {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const fontSize = 10;
    const fontFamily = 'Orbitron';

    // To get a crisp texture, we'll set the font on the context BEFORE measuring the text
    context.font = `bolder ${fontSize}px ${fontFamily}`;

    // Measure text to dynamically size the canvas
    const metrics = context.measureText(text);
    canvas.width = metrics.width;
    canvas.height = fontSize * 1.2; // Add some padding

    // Re-apply the font as context is reset when canvas dimensions change
    context.font = `bolder ${fontSize}px ${fontFamily}`;
    context.fillStyle = '#FFC900'; // A nice golden yellow color
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new CanvasTexture(canvas);
    const material = new SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false, // Don't block other objects behind it
    });

    const sprite = new Sprite(material);

    // Scale the sprite to an appropriate size in the scene
    const spriteWidth = canvas.width * 0.15;
    const spriteHeight = canvas.height * 0.15;
    sprite.scale.set(spriteWidth, spriteHeight, 1);

    // Initially hide the label
    sprite.visible = false;

    return sprite;
  }

  createAnimateCircle() {
    // 创建 圆环 点
    const list = getCirclePoints({
      radius: this.options.earth.radius + 15,
      number: 150, //切割数
      closed: true, // 闭合
    });
    const mat = new MeshBasicMaterial({
      color: '#0c3172',
      transparent: true,
      opacity: 0.4,
      side: DoubleSide,
    });
    const line = createAnimateLine({
      pointList: list,
      material: mat,
      number: 100,
      radius: 0.1,
    });
    this.earthGroup.add(line);

    // 在clone两条线出来
    const l2 = line.clone();
    l2.scale.set(1.2, 1.2, 1.2);
    l2.rotateZ(Math.PI / 6);
    this.earthGroup.add(l2);

    const l3 = line.clone();
    l3.scale.set(0.8, 0.8, 0.8);
    l3.rotateZ(-Math.PI / 6);
    this.earthGroup.add(l3);

    /**
     * 旋转的球
     */
    // const ball = new Mesh(
    //   new SphereBufferGeometry(this.options.satellite.size, 32, 32),
    //   new MeshBasicMaterial({
    //     color: "#e0b187", // 745F4D
    //   })
    // );

    // const ball2 = new Mesh(
    //   new SphereBufferGeometry(this.options.satellite.size, 32, 32),
    //   new MeshBasicMaterial({
    //     color: "#628fbb", // 324A62
    //   })
    // );

    // const ball3 = new Mesh(
    //   new SphereBufferGeometry(this.options.satellite.size, 32, 32),
    //   new MeshBasicMaterial({
    //     color: "#806bdf", //6D5AC4
    //   })
    // );

    // this.circleLineList.push(line, l2, l3);
    // ball.name = ball2.name = ball3.name = "卫星";

    // for (let i = 0; i < this.options.satellite.number; i++) {
    //   const ball01 = ball.clone();
    //   // 一根线上总共有几个球，根据数量平均分布一下
    //   const num = Math.floor(list.length / this.options.satellite.number);
    //   ball01.position.set(
    //     list[num * (i + 1)][0] * 1,
    //     list[num * (i + 1)][1] * 1,
    //     list[num * (i + 1)][2] * 1
    //   );
    //   line.add(ball01);

    //   const ball02 = ball2.clone();
    //   const num02 = Math.floor(list.length / this.options.satellite.number);
    //   ball02.position.set(
    //     list[num02 * (i + 1)][0] * 1,
    //     list[num02 * (i + 1)][1] * 1,
    //     list[num02 * (i + 1)][2] * 1
    //   );
    //   l2.add(ball02);

    //   const ball03 = ball2.clone();
    //   const num03 = Math.floor(list.length / this.options.satellite.number);
    //   ball03.position.set(
    //     list[num03 * (i + 1)][0] * 1,
    //     list[num03 * (i + 1)][1] * 1,
    //     list[num03 * (i + 1)][2] * 1
    //   );
    //   l3.add(ball03);
    // }
  }

  // createFlyLine() {
  //   this.flyLineArcGroup = new Group();
  //   this.flyLineArcGroup.userData["flyLineArray"] = [];
  //   this.earthGroup.add(this.flyLineArcGroup);

  //   this.options.data.forEach((cities) => {
  //     cities.endArray.forEach((item) => {
  //       // 调用函数flyArc绘制球面上任意两点之间飞线圆弧轨迹
  //       const arcline = flyArc(
  //         this.options.earth.radius,
  //         cities.startArray.E,
  //         cities.startArray.N,
  //         item.E,
  //         item.N,
  //         {}
  //         // this.options.flyLine
  //       );

  //       this.flyLineArcGroup.add(arcline); // 飞线插入flyArcGroup中
  //       this.flyLineArcGroup.userData["flyLineArray"].push(
  //         arcline.userData["flyLine"]
  //       );
  //     });
  //   });
  // }

  show() {
    gsap.to(this.group.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 2,
      ease: 'Quadratic',
    });
  }

  render(camera: PerspectiveCamera) {
    this.flyLineArcGroup?.userData['flyLineArray']?.forEach((fly) => {
      // fly.rotation.z += this.options.flyLine.speed; // 调节飞线速度
      if (fly.rotation.z >= fly.flyEndAngle) fly.rotation.z = 0;
    });

    if (this.isRotation) {
      this.earthGroup.rotation.y += this.options.earth.rotateSpeed;
    }

    // this.circleLineList.forEach((e) => {
    //   e.rotateY(this.options.satellite.rotateSpeed);
    // });

    this.uniforms.time.value =
      this.uniforms.time.value < -this.timeValue
        ? this.timeValue
        : this.uniforms.time.value - 1;

    if (this.waveMeshArr.length) {
      this.waveMeshArr.forEach((mesh: Mesh) => {
        mesh.userData['scale'] += 0.007;
        mesh.scale.set(
          mesh.userData['size'] * mesh.userData['scale'],
          mesh.userData['size'] * mesh.userData['scale'],
          mesh.userData['size'] * mesh.userData['scale']
        );
        if (mesh.userData['scale'] <= 1.5) {
          (mesh.material as Material).opacity =
            (mesh.userData['scale'] - 1) * 2; //2等于1/(1.5-1.0)，保证透明度在0~1之间变化
        } else if (
          mesh.userData['scale'] > 1.5 &&
          mesh.userData['scale'] <= 2
        ) {
          (mesh.material as Material).opacity =
            1 - (mesh.userData['scale'] - 1.5) * 2; //2等于1/(2.0-1.5) mesh缩放2倍对应0 缩放1.5被对应1
        } else {
          mesh.userData['scale'] = 1;
        }
      });
    }

    const cameraPosition = new Vector3();
    camera.getWorldPosition(cameraPosition);

    // Combine all labels into one array for easier processing
    const allLabels = [...this.cityLabels];

    allLabels.forEach((label) => {
      if (!label.visible) {
        label.element.style.display = 'none';
        return;
      }
      const labelPosition = new Vector3();
      label.getWorldPosition(labelPosition);
      const labelNormal = labelPosition.clone().normalize();
      const cameraPosition = new Vector3();
      camera.getWorldPosition(cameraPosition);
      const dotProduct = labelNormal.dot(cameraPosition.clone().normalize());
      if (dotProduct < 0.1) {
        label.element.style.display = 'none';
      } else {
        label.element.style.display = 'block';
      }
    });
  }
}
