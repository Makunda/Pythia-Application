import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Account from "@/views/Account.vue";
import HomeFramework from "@/views/framework/HomeFramework.vue";
import FrameworkExploration from "@/components/account/frameworks/FrameworkExploration.vue";
import FrameworkReview from "@/components/account/frameworks/FrameworkReview.vue";
import FrameworkCategorisation from "@/components/account/frameworks/FrameworkCategorisation.vue";
import FrameworkTree from "@/components/account/frameworks/FrameworkTree.vue";
import AccountWidget from "@/components/account/account/AccountWidget.vue";
import NotFound from "@/components/404/NotFound.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
  },
  {
    path: "/login",
    name: "login",
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
    ],
  },
  {
    path: "/frameworks",
    name: "framework",
    component: HomeFramework,

    children: [
      {
        path: "explore",
        name: "frameworks",
        component: FrameworkExploration,
      },
      {
        path: "classification",
        name: "frameworksClassification",
        component: FrameworkCategorisation,
      },
      {
        path: "tree",
        name: "frameworkTree",
        component: FrameworkTree,
      },
      {
        path: "review",
        name: "frameworkReview",
        component: FrameworkReview,
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
  { path: "/api" /** Ignore or pass on to server */ },
  { path: "*", name: "404", component: NotFound },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
