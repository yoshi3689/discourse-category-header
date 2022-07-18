import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "discourse-common/lib/get-owner";

export default {
  setupComponent(attrs, component) {
      withPluginApi("0.11", (api) => {
        api.onPageChange(() => {
          getOwner(this).lookup("router:main")
          .then(res => console.log(res));
          this.set("currentRouteName", router.currentRouteName)
        });
      });
  },
};