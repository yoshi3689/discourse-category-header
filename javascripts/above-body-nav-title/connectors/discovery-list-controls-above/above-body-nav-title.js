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
   
    const categoryLinks = getOwner(this).lookup("service:site").categories;
    const muteCategory = settings.muted_category;
    const currentUser = getOwner(this).lookup("current-user:main");
  
    categoryLinks.forEach(category => {
      if((currentUser && currentUser.admin) ||(!category.isMuted && category.name != "Uncategorized" && category.name !=`${muteCategory}`)){
        const parentUrl = category.parentCategory? `${category.parentCategory.slug}/`:'';
        categoreis.push({
          value: `/c/${parentUrl}${category.slug}/${category.id}`,
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

          const currentUser = getOwner(this).lookup("current-user:main");
          this.set("isAdmin", currentUser && currentUser.admin? true:false);
        
         
          const router = getOwner(this).lookup("router:main");
          console.log("current router", router);
          this.set("isInCategories", router.currentPath === "discovery.categories");
          this.set("isInCategory", router.currentPath === "discovery.category");
          this.set("notInLatest", router.currentPath !== "discovery.latest")


          const buttons = document.querySelector('.category-and-post-filter');
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
          //set title for every category
          const modifyTitle = (url) =>{
            const urlArray = url.split("/");
            const titleArray = urlArray[urlArray.length - 2].split('-');
            const titleCapitalized = titleArray.map(string => {
             return string[0].toUpperCase() + string.substring(1)
            })
            const title = titleCapitalized.join(" ");
            return title;
          }

          if(router.currentRouteName === "discovery.category"){
            title = modifyTitle(router.currentURL);
            this.set("title", title);
          } else if(router.currentRouteName === "discovery.latest"){
            this.set("title", "Latest Discussions");

          } else if(router.currentRouteName === "discovery.categories"){
            this.set("title", "Discussions")
          }
          //building for nav-list
          const urlArray = router.currentURL.split("/");
          this.set("hasParent", urlArray.length > 3);
        //  if(urlArray.length > 3){
        //   const parentName = 

        //  }

         

          const realQuestionBtn = document.querySelector('#create-topic');
          const container = document.querySelector('.body-nav-title');
          if (realQuestionBtn && container) {
            const visibleQuestionBtn = container.querySelector('.question-btn');
            visibleQuestionBtn.addEventListener('click', e => {
              realQuestionBtn.click();
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

    },


    clickButton(){
      const realcategoryBtn = document.querySelector('.edit-category'); 
      if(realcategoryBtn)
         {realcategoryBtn.click();}
    },

    goesTOCategory(){
      DiscourseURL.routeTo('new-category');

    }
    
  },
};