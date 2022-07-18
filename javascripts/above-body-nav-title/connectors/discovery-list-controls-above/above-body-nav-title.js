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
            title = "Latest Discussions"
          } else {
            let withoutFirstSlash = router.currentURL.substring(1);
            withoutFirstSlash = withoutFirstSlash.slice(withoutFirstSlash.indexOf("/")+1, withoutFirstSlash.lastIndexOf("/"));
            withoutFirstSlash = withoutFirstSlash.replaceAll('-', ' ');
            if (withoutFirstSlash.includes(" ")) {
              let titleArr = withoutFirstSlash.split(" ");
              titleArr = titleArr.map(word => word.charAt(0).toUpperCase() + word.slice(1));
              title = titleArr.join(" ");
            } else {
              withoutFirstSlash = withoutFirstSlash.charAt(0).toUpperCase() + withoutFirstSlash.slice(1);
            }
          }
          this.set("title", title);
        });
      });
      // /c/it/1 uncategorized
  },
};