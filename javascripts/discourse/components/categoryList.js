import { withPluginApi } from "discourse/lib/plugin-api";
import { getOwner } from "discourse-common/lib/get-owner";

export default{
    setupComponent(attrs, component) {
        fetch('/categories.json')
        .then(res => res.json())
        .then(res => res.category_list.categories)
        .then(data => data.map(category => {
            return {
              url: `/c/${category.slug}/${category.id}`,
              name: category.name
            };
          })
        )
        .then(data => {
          component.set("categories", data);
        });
    }
}