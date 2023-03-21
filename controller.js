import db from './products.json'

export const HomeApi = (port, baseUrl) => {
  try{
    const context = {
      message: 'Welcome To JSON SERVER',
      api: {
        allProducts: `${baseUrl}:${port}/products`,
        productPermalink: `${baseUrl}:${port}/products/:permalink`
      }
    }
    return context
  }catch(err){
    console.error(err)
  }
}

export const ProductDetail = (req, res) => {
  try{
    let permalink = req.params.permalink

    let product = db.products.data.map(d => d)

    res.json({
      message: 'Detail Product Page',
      data: product.find(d => d.permalink == permalink)
    })
  }catch(err){
    console.error(err)
  }
}