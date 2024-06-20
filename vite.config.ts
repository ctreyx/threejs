/*
 * @Author: tianxun@https://gitee.com/fummmi
 * @Date: 2024-06-17 13:54:37
 * @Description: Do not edit
 * @LastEditors: fumi 330696896@qq.com
 * @LastEditTime: 2024-06-18 11:27:42
 * @FilePath: \threejs\vite.config.ts
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
    host: "0.0.0.0",
  },
});
