<!--
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2024-06-17 13:54:37
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-06-24 14:22:30
 * @FilePath: \threejs\src\demo1.vue
-->
<template>
    <!-- <div >2</div> -->
  </template>
  
  <script setup lang="ts">
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
  import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
  import { Reflector } from "three/examples/jsm/objects/Reflector.js";
  
  // 创建场景
  const scene = new THREE.Scene();
  
  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    75, //视角，越小看到的范围越小
    window.innerWidth / window.innerHeight, //宽高比
    0.1, //近平面
    1000 //远平面
  );
  
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // 设置相机位置
  camera.position.set(0, 1.5, 6);
  
  // 辅助坐标轴
  const axes = new THREE.AxesHelper(5);
  // scene.add(axes);
  
  const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);
  
  // 环境灯,纹理
  new RGBELoader().load("/assets/sky12.hdr", (data) => {
    scene.environment = data;
    scene.background = data;
    scene.mapping = THREE.EquirectangularReflectionMapping;
  });
  
  let model;
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  
  dracoLoader.setDecoderPath("/draco/gltf/");
  loader.setDRACOLoader(dracoLoader);
  
  loader.load("/assets/robot.glb", (gltf: any) => {
    model = gltf.scene;
  
    scene.add(model);
    animate();
  });
  
  // 添加光源
  const lights = [
    [0, 10, 10],
    [0, 10, -10],
    [0, -10, 10],
    [10, -10, 10],
  ];
  lights.forEach((item) => {
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(...item);
    scene.add(light);
  });
  
  // 创建光圈视频
  const video = document.createElement("video");
  video.src = "/assets/zp2.mp4";
  video.loop = true;
  video.muted = true;
  video.play();
  
  // 创建纹理皮肤
  const videoTexture = new THREE.VideoTexture(video);
  const videoGeoPlane = new THREE.PlaneGeometry(8, 4.5);
  const videoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    transparent: true,
    side: THREE.DoubleSide,
    alphaMap: videoTexture, //让平面透明
  });
  const videoMesh = new THREE.Mesh(videoGeoPlane, videoMaterial);
  videoMesh.position.set(0, 0.2, 0);
  videoMesh.rotation.set(-Math.PI / 2, 0, 0);
  scene.add(videoMesh);
  
  // 镜面反射
  const reflectoreGemometry = new THREE.PlaneGeometry(100, 100);
  const reflectorPlane = new Reflector(reflectoreGemometry, {
    textureWidth: window.innerWidth,
    textureHeight: window.innerHeight,
    color: 0x333333,
    recursion: 1,
  });
  reflectorPlane.rotation.x = -Math.PI / 2;
  scene.add(reflectorPlane);
  
  // 渲染函数
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();
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
  