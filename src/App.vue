<!--
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2024-06-17 13:54:37
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-06-20 14:00:20
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
 * @description: cannon可以实现物理世界的材质和摩擦
 * 1. 通过创建盒子，给盒子的材质 friction 设为0
 * 2. 也需要给平板设置friction，所以planeBody添加一个material参数，这个参数放第一个盒子的材质，
 * 第一个盒子材质摩擦设为0.7，所以第一个盒子就不会移动，但是第二个为0的就会移动
 */

let controls: OrbitControls;
// 初始化物理世界
const world = new CANNON.World();
// 设置重力
world.gravity.set(0, -9.82, 0);

// 创建场景
const scene = new THREE.Scene();

const phyMeshes: CANNON.Body[] = [];
const meshes: THREE.Mesh[] = [];

// 创建物理立方体
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
const boxMaterialCon = new CANNON.Material("boxMaterial");
boxMaterialCon.friction = 0.7; //摩擦系数
const boxbody = new CANNON.Body({
  mass: 1,
  shape: boxShape,
  material: boxMaterialCon,
  position: new CANNON.Vec3(0, 5, 0),
});
world.addBody(boxbody);
phyMeshes.push(boxbody);

// 创建一个光滑的盒子
const boxSlippery = new CANNON.Material("boxSlippery");
boxSlippery.friction = 0; //摩擦系数

const boxbody2 = new CANNON.Body({
  mass: 1,
  shape: boxShape,
  material: boxSlippery,
  position: new CANNON.Vec3(3, 5, 0),
});
world.addBody(boxbody2);
phyMeshes.push(boxbody2);

// 创建一个物理几何平面
const planeShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5));
const planeBody = new CANNON.Body({
  mass: 0, //质量为0，碰撞体不受重力影响，不会动
  shape: planeShape,
  position: new CANNON.Vec3(0, 0, 0),
  type: CANNON.Body.STATIC, //静态碰撞体
  material:boxMaterialCon
});
// 旋转
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0.1);

world.addBody(planeBody);

// 创建一个盒子
const BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const boxMesh = new THREE.Mesh(BoxGeometry, boxMaterial);
scene.add(boxMesh);
meshes.push(boxMesh);

// 创建光滑的盒子
const boxMesh2 = new THREE.Mesh(BoxGeometry, boxMaterial);
scene.add(boxMesh2);
meshes.push(boxMesh2);

// 创建一个平面
const planeGeometry = new THREE.BoxGeometry(10, 0.2, 10); //宽高深度
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
// 旋转
planeMesh.rotation.x = 0.1;
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

  for (let i = 0; i < phyMeshes.length; i++) {
    meshes[i].position.copy(phyMeshes[i].position); //计算物理世界的位置
    meshes[i].quaternion.copy(phyMeshes[i].quaternion); //计算物理世界的旋转
  }

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
