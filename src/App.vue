<!--
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2024-06-17 13:54:37
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-06-27 20:00:26
 * @FilePath: \shaoxing-app-2024\src\pages\wind-rain\components\weather-navigations\Observatory.vue
-->
<template>
  <div class="observatory">
    <div ref="canvasRef" class="canvas-container"></div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { onMounted, ref } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { onUnmounted } from "vue";

const canvasRef = ref<HTMLElement>();

// 创建场景
const scene = new THREE.Scene();

// 创建相机
let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
const wheels = [];
let model;

// 添加 模型
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath("/draco/gltf/");
loader.setDRACOLoader(dracoLoader);

// 环境灯
new RGBELoader().load(
  "/textures/equirectangular/venice_sunset_1k.hdr",
  (data) => {
    scene.environment = data;
    scene.environment.mapping = THREE.EquirectangularReflectionMapping;
    scene.fog = new THREE.Fog(0x333333, 10, 15);
  }
);

onMounted(async () => {
  // 初始化渲染器
  renderer.setClearColor("#000");
  renderer.setClearAlpha(0.0);

  camera = new THREE.PerspectiveCamera(
    75, //视角，越小看到的范围越小
    canvasRef.value!.clientWidth / canvasRef.value!.clientHeight, //宽高比
    0.1, //近平面
    1000 //远平面
  );

  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement);

  // 设置相机位置
//   {
//     "x": -0.07656981245787127,
//     "y": 0.09110524714662596,
//     "z": 0.5831561611362057
// }
  // camera.position.set(
  //   -0.008997897045294228,
  //   -0.02519778682781576,
  //   0.16638647342179738
  // );
  camera.position.set(-0.07656981245787127, 0.09110524714662596, 0.5831561611362057);

  // controls.enabled = false;

  renderer.setSize(canvasRef.value!.clientWidth, canvasRef.value!.clientHeight);

  canvasRef.value?.appendChild(renderer.domElement);

  loader.load("/models/88.glb", (gltf: any) => {
    model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh) {
        if (child.name.includes("Box001") || child.name.includes("Box002")) {
          wheels.push(child);
        }
      }
    });

    // model.position.set(0, -0.128, 0);
    arrGroup.push(model);
    scene.add(model);
    animate();
  });

  // 定义点击事件
  window.addEventListener("click", modalClick);
});

onUnmounted(() => {
  window.removeEventListener("click", modalClick);
});

// 初始化射线辅助器
const raycaster = new THREE.Raycaster();
const arrGroup = [];
const mouse = new THREE.Vector2();

const modalClick = (event: MouseEvent) => {
  // 鼠标控制对象
  if (!canvasRef.value) return;

  // 获取canvasRef.value距离屏幕左侧的距离
  const left = canvasRef.value!.getBoundingClientRect().left;
  const top = canvasRef.value!.getBoundingClientRect().top;

  mouse.x = ((event.clientX - left) / renderer.domElement!.clientWidth) * 2 - 1;
  mouse.y =
    -((event.clientY - top) / renderer.domElement!.clientHeight) * 2 + 1;

  // 执行射线检测
  raycaster.setFromCamera(mouse, camera);
  // 判断指定的对象中哪些被该光线照射到了，在arrGroup中筛选
  const intersects = raycaster.intersectObjects(arrGroup);

  if (intersects.length > 0) {
    const clickObj = intersects[0];
    // 旋转网格(mesh)
    console.log("点击的当前模型：", clickObj);
    onCardClicked();
  }
};

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
let yAxis = new THREE.Vector3(0, 1, 0);

// 渲染函数
const animate = () => {
  if (model) {
    rotateAroundWorldAxis(model, yAxis, Math.PI / 128);
    wheels.forEach((wheel) => (wheel.rotation.y -= Math.PI / 128));
  }

  renderer.render(scene, camera);
  controls && controls.update();
  requestAnimationFrame(animate);
};

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;

const video = document.createElement("video");
video.src = "/assets/cloud.mp4";
video.loop = true;
video.muted = true;
video.play();

// 创建纹理皮肤
// const videoTexture = new THREE.VideoTexture(video);
// const videoGeoPlane = new THREE.PlaneGeometry(4, 2.5);
// const videoMaterial = new THREE.MeshBasicMaterial({
//   map: videoTexture,
//   // transparent: true,
//   side: THREE.DoubleSide,
//   // alphaMap: videoTexture, //让平面透明
// });
// const videoMesh = new THREE.Mesh(videoGeoPlane, videoMaterial);
// videoMesh.position.set(0, 0, -1);
// videoMesh.rotation.set(0, 0, 0);
// scene.add(videoMesh);

const onCardClicked = () => {
  console.log(camera.position);
};
</script>

<style>
.observatory {
  width: 100vw;
  height: 100vh;

  background-image: url("/images/cloud.jpg");
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
}

.canvas-container {
  width: 100%;
  height: 100%;
}
</style>
