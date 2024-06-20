<!--
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2024-06-17 13:54:37
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-06-20 09:36:27
 * @FilePath: \threejs\src\demo1.vue
-->
<template>
    <!-- <div >2</div> -->
  </template>
  
  <script setup lang="ts">
  import * as THREE from "three";
  
  /**
   *  1. https://pixabay.com/ 下载图片
   *  2. https://app.immersity.ai/upload 创建3d图片 Qq?3
   *  3. 通过加载纹理，鼠标控制深纹理的变化
   */
  
  // 创建场景
  const scene = new THREE.Scene();
  
  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    90, //视角，越小看到的范围越小
    window.innerWidth / window.innerHeight, //宽高比
    0.1, //近平面
    1000 //远平面
  );
  
  // 设置相机位置
  camera.position.set(0, 0, 6);
  
  // 创建渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 抗锯齿
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  
  // 加载纹理
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load("/images/cat.jpg"); //背景纹理
  const depthTexture = textureLoader.load("/images/cat_depth.jpg"); //深度纹理
  
  // 创建面
  const geometry = new THREE.PlaneGeometry(19.2, 12);
  // const material = new THREE.MeshBasicMaterial({map:texture})
  
  // 鼠标
  const mouse = new THREE.Vector2();
  window.addEventListener("mousemove", (mouseMove) => {
    mouse.x = (mouseMove.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (mouseMove.clientY / window.innerHeight) * 2 + 1;
  });
  
  // 着色器材质
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: texture },
      uDepthTexture: { value: depthTexture },
      uMouse: { value: mouse },
    },
    vertexShader: `
     varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
  `,
  fragmentShader: `
      uniform sampler2D uTexture;
      uniform sampler2D uDepthTexture;
      uniform vec2 uMouse;
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vec4 color = texture2D(uTexture, vUv);
        vec4 depth = texture2D(uDepthTexture, vUv);
        float depthValue = depth.r;
        float x = vUv.x + (uMouse.x+sin(uTime))*0.01*depthValue;
        float y = vUv.y + (uMouse.y+cos(uTime))*0.01*depthValue;
        vec4 newColor = texture2D(uTexture, vec2(x, y));
        gl_FragColor = newColor;
      }
          
      `
      ,
  });
  
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);
  
  // 渲染出来
  renderer.render(scene, camera);
  
  // 渲染函数
  const animate = () => {
    material.uniforms.uMouse.value = mouse;
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
  