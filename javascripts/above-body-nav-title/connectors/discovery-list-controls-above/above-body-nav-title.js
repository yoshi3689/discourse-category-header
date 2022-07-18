import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "discourse-common/lib/get-owner";

export default {
  setupComponent(attrs, component) {
      withPluginApi("0.11", (api) => {
        api.onPageChange(() => {
          const router = getOwner(this).lookup("router:main");
          console.log(router);
          this.set("currentRouteName", router.currentRouteName);
        });
      });
  },
};