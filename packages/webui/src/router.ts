import {
	createRouter,
	createWebHistory,
} from 'vue-router';

const router=createRouter({
	history:createWebHistory(),
	routes:[
		{
			path:'/',
			name:'index',
			component:()=>import('@/routes/Index.vue'),
		},
		{
			path:'/chat',
			name:'chat',
			component:()=>import('@/routes/Chat/Index.vue'),
		},
		{
			path:'/chat/login',
			name:'chatLogin',
			component:()=>import('@/routes/Chat/Login.vue'),
		},
		{
			path:'/kuyou',
			component:()=>import('@/routes/Unimplemented.vue'),
		},
		{
			path:'/:path(.*)*',
			name:'404',
			component:()=>import('@/routes/404.vue'),
		},
	],
});

export default router;
