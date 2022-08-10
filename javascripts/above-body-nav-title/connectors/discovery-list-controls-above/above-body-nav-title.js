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

    const realcategoryBtn = document.querySelector('.edit-category'); 
    component.set("hasRealCategoryButton", realcategoryBtn? true: false);
    const categoreis = [];
   
    const currentUser =  getOwner(this).lookup("current-user:main");
    console.log("currentUser", currentUser);
    const categoryLinks = getOwner(this).lookup("service:site").categories;
    //console.log('categoreis', categoryLinks);
    categoryLinks.forEach(category => {
      if (!category.isMuted && category.name != "Uncategorized"){
        categoreis.push({
          value: `/c/${category.slug}/${category.id}`,
          name: category.name
        })

      }
      
    });

    categoreis.unshift({
      value: '/latest',
      name: 'Latest Discussions'
    })

    component.set("categories", categoreis);

        
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

          // add a class name to main-outlet
          const mainOutlet = document.querySelector("#main-outlet");
          if (mainOutlet.classList.length !== 0) {
            mainOutlet.classList.remove(...mainOutlet.classList);
          }
          mainOutlet.classList.add(window.location.pathname === "/" ? "home" : window.location.pathname.slice(1));

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
          if (realQuestionBtn && container) {
            const visibleQuestionBtn = container.querySelector('.question-btn');
            visibleQuestionBtn.addEventListener('click', e => {
              // console.log(realQuestionBtn, container, visibleQuestionBtn);
              realQuestionBtn.click();
            })
          }
          const realcategoryBtn = document.querySelector('.edit-category'); 
          const actualCategoryBtn = document.querySelector('.edit-category-btn');
          if(realcategoryBtn && !actualCategoryBtn && container ) {
            
            let icon = htmlSafe(renderIcon("string", "wrench"));
            const visibleCategoryBtn = document.createElement('div');
            visibleCategoryBtn.innerHTML = `<button class="edit-category-btn">
             ${icon}
         </button>`;
            
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
    },

    goesTOCategory(){
      DiscourseURL.routeTo('new-category');

    }
    
  },
};