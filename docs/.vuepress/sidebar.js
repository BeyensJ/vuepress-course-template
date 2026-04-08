import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/guide/": [
    {
      text: "Guide",
      icon: "book",
      children: "structure",
    },
  ],
});