<!--
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2024-06-17 13:54:37
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-06-21 14:44:54
 * @FilePath: \threejs\src\demo2.vue
-->
<template>
  <div class="home">
    <div class="canvas-container" ref="canvasRef"></div>

    <div class="home-content">
      <div class="home-content-title">
        <h1>汽车展示与选配</h1>
      </div>
    </div>
  </div>

  <button @click="getPosition">位置</button>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { onMounted, ref } from "vue";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const canvasRef = ref<HTMLElement>();
let controls: OrbitControls;

const wheels = [];

// 创建材质
const wheelsMaterial = new THREE.MeshStandardMaterial({
  color: "#fff",
  // metalness: 1, // 金属度
  // roughness: 0.1, //粗糙度
  // clearcoat: 1, //喷漆
  // clearcoatRoughness: 0.03 //清漆粗糙度
});

const bodyMaterial = new THREE.MeshStandardMaterial({
  color: "#515151",
  // metalness: 1, // 金属度
  // roughness: 0.5, //粗糙度
  // clearcoat: 1, //喷漆
  // clearcoatRoughness: 0.03 //清漆粗糙度
});

let model;

onMounted(() => {
  canvasRef.value!.appendChild(renderer.domElement);
  // 初始化渲染器
  renderer.setClearColor("#000");
  scene.background = new THREE.Color("#ccc");
  scene.environment = new THREE.Color("#ccc");
  render();

  // 渲染网格地面
  const gridHelper = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff);
  scene.background = new THREE.Color(0x333333);

  scene.environment.mapping = THREE.EquirectangularReflectionMapping;
  scene.fog = new THREE.Fog(0x333333, 10, 15);

  gridHelper.material.opacity = 0.8;
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

  loader.load("/models/3344(4).glb", (gltf: any) => {
    const car = gltf.scene;
    model = car;

    car.traverse((child) => {
      if (child.isMesh) {
        console.log(child.name);

        if (child.name.includes("Box008")) {
          // child.material = new THREE.MeshStandardMaterial({
          //   color: "#fff",
          //   // metalness: 1, // 金属度
          //   // roughness: 0.1, //粗糙度
          //   // clearcoat: 1, //喷漆
          //   // clearcoatRoughness: 0.03 //清漆粗糙度
          // });
        }

        if (child.name.includes("Box001") || child.name.includes("Box002")) {
          wheels.push(child);
          // child.material = wheelsMaterial;
        }
      }
    });
 

    scene.add(car);
  });

  // 添加灯光
  const light1 = new THREE.DirectionalLight("#fff", 1);
  light1.position.set(0, -3, 10);
  scene.add(light1);
  // const light2 = new THREE.DirectionalLight("#fff", 1);
  // light2.position.set(0, 0, -10);
  // scene.add(light2);

  // const light3 = new THREE.DirectionalLight("#fff", 1);
  // light3.position.set(10, 0, 0);
  // scene.add(light3);
  // const light4 = new THREE.DirectionalLight("#fff", 1);
  // light4.position.set(-10, 0, 0);
  // scene.add(light4);

  // const light5 = new THREE.DirectionalLight("#fff", 1);
  // light5.position.set(0, 10, 0);
  // scene.add(light5);

  const ambientLight = new THREE.AmbientLight("#fff", 1);
  scene.add(ambientLight);

  animate();
});

//模型对象旋转的函数，每次设置一个坐标轴的变换
function rotateAroundWorldAxis(object, axis, radians) {
  if (!object) return;
  let rotWorldMatrix = new THREE.Matrix4();
  rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
  rotWorldMatrix.multiply(object.matrix);
  object.matrix = rotWorldMatrix;
  object.rotation.setFromRotationMatrix(object.matrix);
}

//调用方式，设置x、y、z轴的旋转
let xAxis = new THREE.Vector3(1, 0, 0);
let yAxis = new THREE.Vector3(0, 1, 0);
let zAxis = new THREE.Vector3(0, 0, 1);
//模型、旋转轴和旋转角度（弧度）

// 渲染函数
const animate = () => {
  requestAnimationFrame(animate);
  rotateAroundWorldAxis(model, yAxis, Math.PI / 64);

  wheels.forEach((wheel) => (wheel.rotation.y -= Math.PI / 64));

  renderer.render(scene, camera);
};

// 创建场景
const scene = new THREE.Scene();

// 创建相机

// width: 141px;
//     height: 267px 
// px
// ;
const camera = new THREE.PerspectiveCamera(
  75, //视角，越小看到的范围越小
  window.innerWidth / window.innerHeight, //宽高比
  0.1, //近平面
  1000 //远平面
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true
// 设置相机位置
// camera.position.set(0, 1, 0);

camera.position.set(
  -0.0014783048137211813,
  0.0814861984134159,
  0.17711794475862197
);
 
 
// 渲染出来
const render = () => {
  renderer.render(scene, camera);
  controls && controls.update();
  requestAnimationFrame(render);
  // camera.position.y+=0.01
};

const getPosition = () => {
  console.log(camera.position);
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
</style>
