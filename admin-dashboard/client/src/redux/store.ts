import { configureStore } from "@reduxjs/toolkit";
import { singInSlice } from "./slices/auth/SingIn";
import { singUpSlice } from "./slices/auth/SingUp";
import userInfoSlice from "./slices/auth/UserInfo";
import { createBlogSlice } from "./slices/blog/CreateBlog";
import { deleteBlogSlice } from "./slices/blog/DeleteBlog";
import { getBlogSlice } from "./slices/blog/GetBlog";
import { getOneBlogSlice } from "./slices/blog/GetOneBlog";
import { updateBlogSlice } from "./slices/blog/UpdateBlog";
import { createCategorySlice } from "./slices/category/CreateCategory";
import { deleteCategorySlice } from "./slices/category/DeleteCategory";
import { getCategorySlice } from "./slices/category/GetCategory";
import { updateCategorySlice } from "./slices/category/UpdateCategory";
import { createClientSlice } from "./slices/clients/CreateClient";
import { deleteClientSlice } from "./slices/clients/DeleteClient";
import { getClientSlice } from "./slices/clients/GetClient";
import { updateClientSlice } from "./slices/clients/UpdateClient";
import { createDesignCategorySlice } from "./slices/design-category/CreateDesignCategories";
import { createDesignSlice } from "./slices/product/createDesign";
import { deleteDesignSlice } from "./slices/product/deleteDesign";
import { getDesignsSlice } from "./slices/product/get-designs";
import { getOneDesignSlice } from "./slices/product/getOneDesign";
import { toggleDesignPrintableSlice } from "./slices/product/toggle-design";
import { updateDesignSlice } from "./slices/product/update-design";
import { createEventSlice } from "./slices/event/createEvent";
import { deleteEventSlice } from "./slices/event/deleteEvent";
import { getEventsSlice } from "./slices/event/get-events";
import { getOneEventSlice } from "./slices/event/getOneEvent";
import { getPastEventsSlice } from "./slices/event/getPastEvents";
import { getUpcomingEventsSlice } from "./slices/event/getUpcomingEvents";
import { toggleEventStatusSlice } from "./slices/event/toggleEventStatus";
import { updateEventSlice } from "./slices/event/update-event";
import { createPrintingSlice } from "./slices/printings/create-printing";
import { deletePrintingSlice } from "./slices/printings/deletePrintingSlice";
import { getPrintingSlice } from "./slices/printings/getPrintingSlice";
import { getPrintingsSlice } from "./slices/printings/getPrintingsSlice";
import { updatePrintingSlice } from "./slices/printings/updatePrintingSlice";
import { createProjectSlice } from "./slices/projects/CreateProject";
import { deleteProjectSlice } from "./slices/projects/DeleteProject";
import { getoneProjectSlice } from "./slices/projects/GetOneProject";
import { getProjectSlice } from "./slices/projects/GetProject";
import { updateOrderProject } from "./slices/projects/Project-Order";
import { updateProjectSlice } from "./slices/projects/UpdateProject";
import { createTeamSlice } from "./slices/teams/CreateTeam";
import { deleteTeamSlice } from "./slices/teams/DeleteTeam";
import { getTeamSlice } from "./slices/teams/GetTeam";
import { updateOrderTeam } from "./slices/teams/Team-Order";
import { updateTeamSlice } from "./slices/teams/UpdateTeam";
import { createUserSlice } from "./slices/users/createUser";
import { deleteUserSlice } from "./slices/users/deleteUser";
import { getUserSlice } from "./slices/users/getUser";
import { updateUserSlice } from "./slices/users/updateUser";
import { getDesignCategoriesSlice } from "./slices/design-category/GetDesignCategories";
import { updateDesignCategorySlice } from "./slices/design-category/UpdateDesignCategories";
import { deleteDesignCategorySlice } from "./slices/design-category/DeleteDesignCategories";
import { getBannersSlice } from "./banner/getBannersSlice";
import { createBannerSlice } from "./banner/createBannerSlice";
import { updateBannerSlice } from "./banner/updateBannerSlice";
import { deleteBannerSlice } from "./banner/deleteBannerSlice";
import { toggleBannerActiveSlice } from "./banner/toggleBannerActiveSlice";
import { getSideCardsSlice } from "./banner/getSideCardsSlice";
import { createSideCardSlice } from "./banner/createSideCardSlice";
import { updateSideCardSlice } from "./banner/updateSideCardSlice";
import { deleteSideCardSlice } from "./banner/deleteSideCardSlice";
import { getComponentTypesSlice } from "./slices/component/getComponentTypes";
import { getOneComponentTypeSlice } from "./slices/component/getOneComponentType";
import { createComponentTypeSlice } from "./slices/component/createComponentType";
import { updateComponentTypeSlice } from "./slices/component/updateComponentType";
import { deleteComponentTypeSlice } from "./slices/component/deleteComponentType.slice";
import { getComponentOptionsSlice } from "./slices/component/getComponentOptions.slice";
import { getOneComponentOptionSlice } from "./slices/component/getOneComponentOption.slice";
import { createComponentOptionSlice } from "./slices/component/createComponentOption.slice";
import { updateComponentOptionSlice } from "./slices/component/updateComponentOption.slice";
import { deleteComponentOptionSlice } from "./slices/component/deleteComponentOption.slice";
import { getProductComponentsSlice } from "./slices/component/getProductComponents.slice";
import { getOneProductComponentSlice } from "./slices/component/getOneProductComponent.slice";
import { createProductComponentSlice } from "./slices/component/createProductComponent.slice";
import { updateProductComponentSlice } from "./slices/component/updateProductComponent.slice";
import { deleteProductComponentSlice } from "./slices/component/deleteProductComponent.slice";
import createOrderDesignReducer from "./slices/orderDesign/createOrderDesign";
import getAllOrderDesignsReducer from "./slices/orderDesign/getAllOrderDesigns";
import getOrderDesignReducer from "./slices/orderDesign/getOrderDesign";
import updateOrderDesignReducer from "./slices/orderDesign/updateOrderDesign";
import deleteOrderDesignReducer from "./slices/orderDesign/deleteOrderDesign";
import getPostTypesReducer from "./slices/orderDesign/getPostTypes";
export const store = configureStore({
  reducer: {
    // Auth
    singin: singInSlice.reducer,
    singup: singUpSlice.reducer,

    // UserInfo
    userInfo: userInfoSlice.reducer,

    // Clients
    createClient: createClientSlice.reducer,
    updateClient: updateClientSlice.reducer,
    getClient: getClientSlice.reducer,
    deleteClient: deleteClientSlice.reducer,

    // Users
    createUser: createUserSlice.reducer,
    updateUser: updateUserSlice.reducer,
    deleteUser: deleteUserSlice.reducer,
    getUser: getUserSlice.reducer,

    // Teams
    createTeam: createTeamSlice.reducer,
    updateTeam: updateTeamSlice.reducer,
    deleteTeam: deleteTeamSlice.reducer,
    getTeam: getTeamSlice.reducer,
    // Project
    createProject: createProjectSlice.reducer,
    updateProject: updateProjectSlice.reducer,
    getProject: getProjectSlice.reducer,
    deleteProject: deleteProjectSlice.reducer,
    // events
    createEvent: createEventSlice.reducer,
    updateEvent: updateEventSlice.reducer,
    getEvents: getEventsSlice.reducer,
    getOneEvent: getOneEventSlice.reducer,
    deleteEvent: deleteEventSlice.reducer,
    toggleEventStatus: toggleEventStatusSlice.reducer,
    getUpcomingEvents: getUpcomingEventsSlice.reducer,
    getPastEvents: getPastEventsSlice.reducer,
    //designs
    getDesigns: getDesignsSlice.reducer,
    getOneDesign: getOneDesignSlice.reducer,
    createDesign: createDesignSlice.reducer,
    updateDesign: updateDesignSlice.reducer,
    deleteDesign: deleteDesignSlice.reducer,
    toggleDesignPrintable: toggleDesignPrintableSlice.reducer,
    // categories
    getCategory: getCategorySlice.reducer,
    createCategory: createCategorySlice.reducer,
    updateCategory: updateCategorySlice.reducer,
    deleteCategory: deleteCategorySlice.reducer,

    //project

    getoneproject: getoneProjectSlice.reducer,
    orderProject: updateOrderProject.reducer,

    //team

    orderTeam: updateOrderTeam.reducer,

    //Blog

    createBlog: createBlogSlice.reducer,
    getAllBlogs: getBlogSlice.reducer,
    getOneBlog: getOneBlogSlice.reducer,
    updateBlog: updateBlogSlice.reducer,
    deleteBlog: deleteBlogSlice.reducer,

    // printings

    createPrinting: createPrintingSlice.reducer,
    getPrintings: getPrintingsSlice.reducer,
    getPrinting: getPrintingSlice.reducer,
    updatePrinting: updatePrintingSlice.reducer,
    deletePrinting: deletePrintingSlice.reducer,

    // categories Design
    getCategoryDesign: getDesignCategoriesSlice.reducer,
    createCategoryDesign: createDesignCategorySlice.reducer,
    updateCategoryDesign: updateDesignCategorySlice.reducer,
    deleteCategoryDesign: deleteDesignCategorySlice.reducer,

    // Banners
    getBanners: getBannersSlice.reducer,
    createBanner: createBannerSlice.reducer,
    updateBanner: updateBannerSlice.reducer,
    deleteBanner: deleteBannerSlice.reducer,
    toggleBannerActive: toggleBannerActiveSlice.reducer,

    // Side Cards
    getSideCards: getSideCardsSlice.reducer,
    createSideCard: createSideCardSlice.reducer,
    updateSideCard: updateSideCardSlice.reducer,
    deleteSideCard: deleteSideCardSlice.reducer,

    // Component Types
    getComponentTypes: getComponentTypesSlice.reducer,
    getOneComponentType: getOneComponentTypeSlice.reducer,
    createComponentType: createComponentTypeSlice.reducer,
    updateComponentType: updateComponentTypeSlice.reducer,
    deleteComponentType: deleteComponentTypeSlice.reducer,

    // Component Options
    getComponentOptions: getComponentOptionsSlice.reducer,
    getOneComponentOption: getOneComponentOptionSlice.reducer,
    createComponentOption: createComponentOptionSlice.reducer,
    updateComponentOption: updateComponentOptionSlice.reducer,
    deleteComponentOption: deleteComponentOptionSlice.reducer,

    // Product Components
    getProductComponents: getProductComponentsSlice.reducer,
    getOneProductComponent: getOneProductComponentSlice.reducer,
    createProductComponent: createProductComponentSlice.reducer,
    updateProductComponent: updateProductComponentSlice.reducer,
    deleteProductComponent: deleteProductComponentSlice.reducer,

    // Order Design
    createOrderDesign: createOrderDesignReducer,
    getAllOrderDesigns: getAllOrderDesignsReducer,
    getOrderDesign: getOrderDesignReducer,
    updateOrderDesign: updateOrderDesignReducer,
    deleteOrderDesign: deleteOrderDesignReducer,
    getPostTypes: getPostTypesReducer,
  },
  // devTools: false,
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
