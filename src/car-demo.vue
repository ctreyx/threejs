<!--
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2024-06-17 13:54:37
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-06-21 17:32:01
 * @FilePath: \threejs\src\App.vue
-->
<template>
  <div class="home">
    <div class="canvas-container" ref="canvasRef"></div>

    <div class="home-content">
      <h2>选择车身颜色</h2>

      <div class="select">
        <div class="colorPicker">
          <input
            id="body-color"
            type="color"
            value="#ff0000"
            @input="(e) => selectColor(e, 'bodyMaterial')"
          /><br />车身
        </div>

        <div class="colorPicker">
          <input
            id="details-color"
            type="color"
            value="#ffffff"
            @input="(e) => selectColor(e, 'wheelsMaterial')"
          /><br />车轮毂
        </div>
        <div class="colorPicker">
          <input
            id="glass-color"
            type="color"
            value="#ffffff"
            @input="(e) => selectColor(e, 'glassMaterial')"
          /><br />车窗
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const canvasRef = ref<HTMLElement>();
let controls: OrbitControls;

const wheels: any = [];
let gridHelper;
let carbody, carglass;
// 创建材质
const bodyMaterial = new THREE.MeshStandardMaterial({
  color: "#ff0000",
  metalness: 1, // 金属度
  roughness: 0.5, //粗糙度
  clearcoat: 1, //喷漆
  clearcoatRoughness: 0.03, //清漆粗糙度
});

const wheelsMaterial = new THREE.MeshStandardMaterial({
  color: "#ffffff",
  metalness: 1, // 金属度
  roughness: 0.1, //粗糙度
});

const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.25,
  roughness: 0,
  transmission: 1.0,
});

const selectColor = (e: any, type: string) => {
  if (type === "bodyMaterial") {
    bodyMaterial.color.set(e.target.value);
  } else if (type === "wheelsMaterial") {
    wheelsMaterial.color.set(e.target.value);
  } else if (type === "glassMaterial") {
    glassMaterial.color.set(e.target.value);
  }
};

onMounted(() => {
  canvasRef.value!.appendChild(renderer.domElement);


renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setSize(canvasRef.value!.clientWidth, canvasRef.value!.clientHeight)
  window.addEventListener("resize", onWindowResize);

  // 渲染网格地面
  gridHelper = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
  scene.background = new THREE.Color(0x333333);

  // 环境灯
  scene.background = new THREE.Color(0x333333);
  scene.environment = new RGBELoader().load(
    "/textures/equirectangular/venice_sunset_1k.hdr"
  );
  scene.environment.mapping = THREE.EquirectangularReflectionMapping;
  scene.fog = new THREE.Fog(0x333333, 10, 15);

  gridHelper.material.opacity = 0.2;
  gridHelper.material.depthWrite = false;
  gridHelper.material.transparent = true;

  scene.add(gridHelper);

  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // 添加汽车模型
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/gltf/");
  loader.setDRACOLoader(dracoLoader);

  // 初始化射线辅助器
	const raycaster = new THREE.Raycaster();
  const arrGroup :any[]= []


  loader.load("/models/car.glb", (gltf: any) => {
    const car = gltf.scene;

    car.traverse((child: any) => {
      if (child.isMesh) {
        // 轮毂
        if (child.name.includes("wheel")) {
          wheels.push(child);
          child.material = wheelsMaterial;
        }
        // 车身
        if (child.name.includes("body")) {
          carbody = child;
          carbody.material = bodyMaterial;
        }
        // 玻璃
        if (child.name.includes("glass")) {
          carglass = child;
          carglass.material = glassMaterial;
        }
        // 控制台 steering是方向盘
        if (child.name.includes("rim")) {
          carglass = child;
          carglass.material = bodyMaterial;
        }
      }
    });

    car.position.set(0, -0.128, -0.03)

    // 阴影
    const shadow = new THREE.TextureLoader().load("/gltf/ferrari_ao.png");
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
      new THREE.MeshBasicMaterial({
        map: shadow,
        blending: THREE.MultiplyBlending,
        toneMapped: false,
        transparent: true,
      })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.renderOrder = 2;
    car.add(mesh);
    arrGroup.push(car)
    scene.add(car);
  });



  // 定义点击事件
  canvasRef.value?.addEventListener("click", (event) => {
    // 鼠标控制对象
    const mouse = new THREE.Vector2();
    // 得到鼠标相对于容器的坐标
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;


    console.log(event.clientX)
    console.log(event.clientY)
    console.log(mouse.x)
    console.log(mouse.y)
    // 执行射线检测
    raycaster.setFromCamera(mouse, camera);
    // 判断指定的对象中哪些被该光线照射到了，在arrGroup中筛选
    const intersects = raycaster.intersectObjects(arrGroup);
    // const intersects = raycaster.intersectObjects(scene.children)
    // 射线涉及到的物体集合
    console.log("intersects:", intersects);

    if (intersects.length > 0) {
      const clickObj = intersects[0];
      // 旋转网格(mesh)
      console.log("点击的当前模型：", clickObj);
    }
  });

  render();
});

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
  40, //视角，越小看到的范围越小
  window.innerWidth / window.innerHeight, //宽高比
  0.1, //近平面
  100 //远平面
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;

// 设置相机位置
camera.position.set(4.25, 1.4, -4.5);
 
// 渲染出来
const render = () => {
  renderer.render(scene, camera);
  controls && controls.update();

  const time = -performance.now() / 1000;

  for (let i = 0; i < wheels.length; i++) {
    wheels[i].rotation.x = time * Math.PI * 2;
  }

  // 地面往前进
  gridHelper!.position.z = -time % 1;

  requestAnimationFrame(render);
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

.home-content {
  position: fixed;
  top: 0;
  color: #fff;
  /* 左右居中 */
  left: 50%;
  transform: translateX(-50%);
}

.select {
  display: flex;
  justify-content: space-evenly;
}

.colorPicker {
  width: 50px;
  height: 50px;
  /* border: 1px solid #ccc; */
  margin: 10px;
  display: inline-block;
  cursor: pointer;
  border-radius: 10px;
}

.colorPicker input {
  width: 50px;
  height: 30px;
}

.canvas-container{
  width: 50vw;
}
</style>
