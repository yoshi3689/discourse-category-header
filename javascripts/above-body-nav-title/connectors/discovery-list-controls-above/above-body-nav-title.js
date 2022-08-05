import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "discourse-common/lib/get-owner";
import DiscourseURL from "discourse/lib/url";
import { htmlSafe } from "@ember/template";
import { renderIcon } from "discourse-common/lib/icon-library";


export default {

  setupComponent(attrs, component) {
    
    const statuses = ["likes", "views", "activities"].map((status) => {
      return {
        name: status,
        value: status,
      };
    });
    component.set("statuses", statuses);

    //check if has edit category button
    const realcategoryBtn = document.querySelector('.edit-category'); 
    component.set("hasRealCategoryButton", realcategoryBtn? true: false);
    //console.log("hasRealCategoryButton", component.hasRealCategoryButton);


    const router = getOwner(this).lookup("router:main");
    component.set("isOnCategories", router.currentRouteName === "discovery.categories")
    //console.log("isOncategoreis", component.isOnCategories);

  

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
              //const btnTextVisible = visibleQuestionBtn.querySelector(".btn-text");
          //const btnTextReal = realQuestionBtn.querySelector(".d-button-label");
            })
          }
          const realcategoryBtn = document.querySelector('.edit-category'); 
          const actualCategoryBtn = document.querySelector('.edit-category-btn');
          if(realcategoryBtn && !actualCategoryBtn ) {
            //const visibleCategoryBtn = document.querySelector('.edit-category-btn')
            const {
              iconNode
            } = require("discourse-common/lib/icon-library");
            let icon = htmlSafe(renderIcon("string", "wrench"));
            console.log("icon", icon);
            const visibleCategoryBtn = document.createElement('div');
            visibleCategoryBtn.innerHTML = `<button class="edit-category-btn">
             ${icon}
         </button>`;
         //visibleCategoryBtn.appendChild(htmlSafe(renderIcon("string", icon)));
            
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

    },

    selectCategoryAdminDropdownAction(actionId) {
      switch (actionId) {
        case "create":
          this.createCategory();
          break;
        case "reorder":
          this.reorderCategories();
          break;
      }
    },

    clickButton(){
      const realcategoryBtn = document.querySelector('.edit-category'); 
      realcategoryBtn.click();
    }
    
  },
};