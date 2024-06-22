<!--
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2024-06-17 13:54:37
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-06-21 15:15:44
 * @FilePath: \threejs\src\demo1.vue
-->
<template>
  <!-- <div >2</div> -->
</template>

<script setup lang="ts">
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

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
scene.add(axes);

const controls: OrbitControls = new OrbitControls(camera, renderer.domElement);

// 环境灯,纹理
new RGBELoader().load('/assets/sky12.hdr', data => {
  
  scene.environment = data
  scene.background = data
  scene.mapping = THREE.EquirectangularReflectionMapping

  // scene.fog = new THREE.Fog(0x333333, 10, 15)
})


// 渲染出来
renderer.render(scene, camera);

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
