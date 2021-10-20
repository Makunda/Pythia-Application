import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Account from "@/views/Account.vue";
import HomeFramework from "@/views/framework/HomeFramework.vue";
import ViewFramework from "@/views/framework/ViewFramework.vue";
import AddFramework from "@/views/framework/AddFramework.vue";
import AllFramework from "@/views/framework/AllFramework.vue";
import FrameworkExploration from "@/components/account/frameworks/FrameworkExploration.vue";
import FrameworkReview from "@/components/account/frameworks/FrameworkReview.vue";
import FrameworkCategorisation from "@/components/account/frameworks/FrameworkCategorisation.vue";
import FrameworkTree from "@/components/account/frameworks/FrameworkTree.vue";
import AccountWidget from "@/components/account/account/AccountWidget.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/account",
    name: "account",
    component: Account,

    children: [
      {
        path: "",
        name: "overview",
        component: AccountWidget,
      },
      {
        path: "overview",
        name: "overview",
        component: AccountWidget,
      },
      {
        path: "frameworks",
        name: "frameworks",
        component: FrameworkExploration,
      },
      {
        path: "frameworksClassification",
        name: "frameworksClassification",
        component: FrameworkCategorisation,
      },
      {
        path: "frameworkTree",
        name: "frameworkTree",
        component: FrameworkTree,
      },
      {
        path: "frameworkReview",
        name: "frameworkReview",
        component: FrameworkReview,
      },
    ],
  },
  {
    path: "/framework",
    name: "framework",
    component: HomeFramework,

    children: [
      {
        path: "",
        name: "home",
        component: AllFramework,
      },
      {
        path: "add",
        name: "add",
        component: AddFramework,
      },
      {
        path: "view/:id",
        name: "view",
        props: true,
        component: ViewFramework,
      },
    ],
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
