import { defineConfig } from "vite";

// do all changes on dist folder first as it provides the 'npm run preivew' command
// once it looks good then change the actual files in public, src, etc ... 
export default defineConfig({
    base: "/Web-Portfolio",
    build: {
        minify: "terser",
    },
});