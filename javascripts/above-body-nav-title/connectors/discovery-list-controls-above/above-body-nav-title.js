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
          const buttons = document.querySelector('.filter-icons-container');
          if(router.currentRouteName === "discovery.categories")
          {
            if (buttons && !buttons.classList.contains("do-not-display")){
              buttons.classList.add("do-not-display")
            }
          } else {
            if(buttons && buttons.classList.contains('do-not-display')){
              buttons.classList.remove('do-not-display');
             }
          }
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
          } else if (router.currentRouteName === "discovery.latest" || router.currentRouteName.includes("categories")) {
            this.set("title", "Latest Discussions");
          } 

          const realQuestionBtn = document.querySelector('#create-topic');
          const container = document.querySelector('.body-nav-title');
          if (realQuestionBtn) {
            
            const visibleQuestionBtn = container.querySelector('.question-btn');
            visibleQuestionBtn.addEventListener('click', e => {
              realQuestionBtn.click();
          const realQuestionBtn = document.querySelector('#create-topic'); 
              // const btnTextVisible = visibleQuestionBtn.querySelector(".btn-text");
          // const btnTextReal = realQuestionBtn.querySelector(".d-button-label");
            })
          }
          const realcategoryBtn = document.querySelector('.edit-category'); 
          if(realcategoryBtn) {
            const visibleCategoryBtn = document.createElement('d-button')
            visibleCategoryBtn.setAttribute(icon,"wrench");
            visibleCategoryBtn.classList.add("btn-default");
            visibleCategoryBtn.addEventListener('click', e=>{
              realcategoryBtn.click();
            })
            container.appendChild(visibleCategoryBtn)
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