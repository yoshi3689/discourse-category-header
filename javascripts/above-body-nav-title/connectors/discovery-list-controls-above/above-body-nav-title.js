import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "discourse-common/lib/get-owner";
import DiscourseURL from "discourse/lib/url";


export default {

  setupComponent(attrs, component) {
    
    const statuses = ["likes", "views", "activities"].map((status) => {
      return {
        name: status,
        value: status,
      };
    });
    component.set("statuses", statuses);

    fetch('/categories.json')
        .then(res => res.json())
        .then(res => res.category_list.categories)
        .then(data => data.map(category => {
            return {
              value: `/c/${category.slug}/${category.id}`,
              name: category.name
            };
          })
        )
        .then(category => {
          category.unshift({
            value: '/latest',
            name: 'Latest Discussions'
          });
          component.set("categories", category);
        });
        
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
    changeCategory(newStatus){

      DiscourseURL.routeTo(newStatus);

    }
    
  },
};