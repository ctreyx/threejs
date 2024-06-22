<!--
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2024-06-17 13:54:37
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-06-20 15:49:21
 * @FilePath: \threejs\src\demo1.vue
-->
<template>
    <!-- <div >2</div> -->
  </template>
  
  <script setup lang="ts">
  import * as THREE from "three";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
  
  /**
   * 3d房屋场景
   * 通过创建一个球体，然后将图片贴图到球体上，实现一个360度全景图
   * 1.THREE.SphereGeometry创建球体
   * 2.导入loader, RGBELoader 用于加载hdr格式的图片
   * 3.THREE.MeshBasicMaterial({ map: texture })创建材质贴上球体
   */
  
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
  
  // 添加控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  
  // 设置相机位置
  camera.position.z = 0.1;
  
  // const roomImgs = ["4_l", "4_r", "4_u", "4_d", "4_b", "4_f"];
  // const boxMaterials: THREE.MeshBasicMaterial[] = [];
  
  // // 循环贴图
  // roomImgs.forEach((item) => {
  //   // 纹理加载
  //   const texture = new THREE.TextureLoader().load(
  //     `/images/room/living/${item}.jpg`
  //   );
  //   if (item === "4_u" || item === "4_d") {
  //     texture.rotation = Math.PI;
  //     texture.center = new THREE.Vector2(0.5, 0.5);
  //   }
  
  //   boxMaterials.push(new THREE.MeshBasicMaterial({ map: texture }));
  // });
  
  
  // 创建立方体
  // const geometry = new THREE.BoxGeometry(10, 10, 10);
  const geometry = new THREE.SphereGeometry(5, 32, 32); //球体
  const loader = new RGBELoader();
  loader.load(`/images/room/hdr/Living.hdr`, (texture:THREE.texture) => {
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const cube = new THREE.Mesh(geometry, material);
    cube.geometry.scale(1, 1, -1); //cube的几何体z轴反方向，相当于我们在空间内部
    scene.add(cube);
  });
  
  // const cube = new THREE.Mesh(geometry, boxMaterials);
  // cube.geometry.scale(1, 1, -1); //cube的几何体z轴反方向，相当于我们在空间内部
  // scene.add(cube);
  
  // 渲染函数
  const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
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
  