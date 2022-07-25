import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "discourse-common/lib/get-owner";
import Controller, { inject as controller } from "@ember/controller";


export default {
  // shouldRender(args, component) {
  //   const router = getOwner(this).lookup("router:main");

  //   if (
  //     !component.siteSettings.show_filter_by_solved_status ||
  //     router.currentPath === "discovery.categories"
  //   ) {
  //     return false;
  //   } else if (component.siteSettings.allow_solved_on_all_topics) {
  //     return true;
  //   } else {
  //     const controller = getOwner(this).lookup(
  //       "controller:navigation/category"
  //     );
  //     return controller && controller.get("category.enable_accepted_answers");
  //   }
  // },
  setupComponent(attrs, component) {
    
    const statuses = ["likes", "views", "activities"].map((status) => {
      return {
        name: status,
        value: status,
      };
    });
    component.set("statuses", statuses);
      withPluginApi("0.11", (api) => {
        api.onPageChange(() => {
          const router = getOwner(this).lookup("router:main");
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

          const realQuestionBtn = document.querySelector('#create-topic');
          if (realQuestionBtn) {
            const container = document.querySelector('.body-nav-title');
            const visibleQuestionBtn = container.querySelector('.question-btn');
            visibleQuestionBtn.addEventListener('click', e => {
              realQuestionBtn.click();
              // const btnTextVisible = visibleQuestionBtn.querySelector(".btn-text");
          // const btnTextReal = realQuestionBtn.querySelector(".d-button-label");
            })
          }
        });
      });
  },

  actions: {
  
    changeStatus(newStatus) {
        
        const router = getOwner(this).lookup("router:main");
        router.transitionTo({ queryParams: { order: newStatus } });
      
      
    },
    changeCategory(newCategory) {
      const router = getOwner(this).lookup("router:main");
      // router.transitionTo


    }
  },
};