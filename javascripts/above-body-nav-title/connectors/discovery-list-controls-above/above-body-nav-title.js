import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "discourse-common/lib/get-owner";

export default {
  setupComponent(attrs, component) {
      withPluginApi("0.11", (api) => {
        api.onPageChange(() => {
          const router = getOwner(this).lookup("router:main");
          // TODO: use discourse API to get the categories for dynamically changing the title value
          let title = "";

          if (router.currentURL.includes("/c/")) {
            fetch('/categories.json')
            .then(res => res.json())
            .then(res => res.category_list.categories)
            .then(data => data.find(category => router.currentURL.includes(category.slug))
            )
            .then(data => {
              this.set("title", data? data.name : "Uncategorized");
            });
          } else if (router.currentRouteName === "discovery.latest") {
            this.set("title", "Latest Discussions");
          } else if (router.currentRouteName === "discovery.categories") {
            this.set("title", "Categories");
          } 
        });
      });
  },
};