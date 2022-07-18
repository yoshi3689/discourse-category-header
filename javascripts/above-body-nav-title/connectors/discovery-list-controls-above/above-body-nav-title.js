import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "discourse-common/lib/get-owner";

export default {
  setupComponent(attrs, component) {
      withPluginApi("0.11", (api) => {
        api.onPageChange(() => {
          const router = getOwner(this).lookup("router:main");
          console.log(router);
          let title = "";
          if (router.currentURL === "/c/it/1") {
            title = "Uncategorized"
          } else if (router.currentURL === "/") {
            title = "Discussions"
          } else {
            let withoutFirstSlash = router.currentURL.substring(1);
            withoutFirstSlash = withoutFirstSlash.slice(withoutFirstSlash.indexOf("/"), withoutFirstSlash.lastIndexOf("/"));
            title = withoutFirstSlash.replaceAll('-', ' ');
          }
          this.set("title", router.currentURL);
        });
      });
      // /c/it/1 uncategorized
  },
};