
import { getOwner } from "discourse-common/lib/get-owner";


export default {
  shouldRender(args, component) {
    const router = getOwner(this).lookup("router:main");

    if (
      !component.siteSettings.show_filter_by_solved_status ||
      router.currentPath === "discovery.categories"
    ) {
      return false;
    } else if (component.siteSettings.allow_solved_on_all_topics) {
      return true;
    } else {
      const controller = getOwner(this).lookup(
        "controller:navigation/category"
      );
      return controller && controller.get("category.enable_accepted_answers");
    }
  },

  setupComponent(args, component) {
    const statuses = ["likes", "views", "activities"].map((status) => {
      return {
        name: status,
        value: status,
      };
    });
    component.set("statuses", statuses);



  },

  actions: {
  
    changeStatus(newStatus) {
      
        const router = getOwner(this).lookup("router:main");
        router.transitionTo({ queryParams: { order: newStatus } });
      
      
    },
  },

  
};