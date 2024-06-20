<!--
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2024-06-17 13:54:37
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-06-20 11:36:32
 * @FilePath: \threejs\src\demo1.vue
-->
<template>
    <!-- <div >2</div> -->
  </template>
  
  <script setup lang="ts">
  import * as THREE from "three";
  import * as CANNON from "cannon-es";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  
  /**
   * @description: cannon可以实现物理世界的模拟
   *
   * 1.通过CANNON创建球体，放入wolrd中
   * 2.通过THREE创建球体，放入scene中
   * 3.将three球体的位置copy物理世界球体的位置，即可实现物理世界的同步
   * 4.创建平面Plane会无限延伸，球体无法掉下去，所以创建Box盒子
   */
  
  let controls: OrbitControls;
  // 初始化物理世界
  const world = new CANNON.World();
  // 设置重力
  world.gravity.set(0, -9.82, 0);
  
  // 创建场景
  const scene = new THREE.Scene();
  
  // 创建球体
  const sphereShape = new CANNON.Sphere(0.5);
  // 物理世界需要做成一个刚体，有重量
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 5, 0),
    shape: sphereShape,
  });
  world.addBody(sphereBody);
  
  // 创建一个物理几何平面
  // const planeShape = new CANNON.Plane();
  const planeShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5));
  
  const planeBody = new CANNON.Body({
    mass: 0, //质量为0，碰撞体不受重力影响，不会动
    shape: planeShape,
    position: new CANNON.Vec3(0, 0, 0),
    type: CANNON.Body.STATIC, //静态碰撞体
  });
  // 旋转
  // planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2.1);
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0),0.1);
  
  world.addBody(planeBody);
  
  // 创建一个球体几何体
  const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  //创建一个球体材质
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // 创建一个球体网格
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  // 将球体网格添加到场景中
  scene.add(sphereMesh);
  
  // 创建一个平面
  // const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const planeGeometry = new THREE.BoxGeometry(10, 0.2,10);  //宽高深度
  
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  // 旋转
  // planeMesh.rotation.x = -Math.PI / 2.1;
  planeMesh.rotation.x =  0.1;
  
  scene.add(planeMesh);
  
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
  camera.position.z = 10;
  
  // 渲染出来
  renderer.render(scene, camera);
  
  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement);
  
  // 渲染函数
  const clock = new THREE.Clock();
  const animate = () => {
    const delta = clock.getDelta();
  
    world.step(
      1 / 60,
      delta, // 补针
      10 //最大补针次数
    );
  
    // 更新球体位置
    sphereMesh.position.copy(sphereBody.position); //计算物理世界的位置
    sphereMesh.quaternion.copy(sphereBody.quaternion); //计算物理世界的旋转
  
    // 更新平面位置
    planeMesh.position.copy(planeBody.position);
  
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
  