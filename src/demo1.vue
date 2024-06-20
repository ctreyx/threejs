<!--
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2024-06-17 13:54:37
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-06-17 13:57:46
 * @FilePath: \threejs\src\demo1.vue
-->
<template>
  <!-- <div >2</div> -->
</template>

<script setup lang="ts">
import * as THREE from "three";

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
camera.lookAt(0, 0, 0);

// 渲染出来
renderer.render(scene, camera);

// 渲染函数
const animate = () => {
  requestAnimationFrame(animate);
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
