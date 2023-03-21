import {HomeApi, ProductDetail} from './controller.js'

export const Home = (router, port, baseUrl) => {
	router.get('/', (req, res) => {
		res.json(HomeApi(port, baseUrl))
	})
}

export const Detail = (router) => {
	router.get('/product/:permalink', ProductDetail)
}