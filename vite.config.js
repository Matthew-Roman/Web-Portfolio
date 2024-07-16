import { defineConfig } from "vite";

// when changing the site change the base name to ./ then revert it back once all changes have been finished 
export default defineConfig({
    base: "/Web-Portfolio",
    build: {
        minify: "terser",
    },
});
