const { Router, response } = require('express');
var express = require('express');
const {render} = require('../app');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
let admin = req.session.admin
console.log(admin)
if(req.session.admin){
  productHelpers.getAllproducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products})
  })
}else{
  res.render('admin/admin-login',{'loginErr':req.session.adminlogginErr})
}



});

router.get('/add-product',function(req,res){
  res.render('admin/add-product')
})



router.post('/add-product',(req,res)=>{
 
  productHelpers.addProduct(req.body,(id)=>{
    let image = req.files.Image
    console.log(id);
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if (!err){
        res.render ("admin/add-product")

      }else{
        console.log(err);
      }
    })
    
  })
})
router.get('/delete-product/:id',(req,res)=>{
   let proId= req.params.id
   console.log(proId)
   productHelpers.deleteProduct(proId).then((response)=>{
     res.redirect('/admin/')
   })
})

router.get('/edit-product/:id',async(req,res)=>{
  let product = await productHelpers.getProductDetailes(req.params.id)
  //console.log(product)
  res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  let id = req.params.id
  productHelpers.updateProduct(req.params.id, req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image = req.files.Image
      image.mv('./public/product-images/'+id+'.jpg')
    }
  })
})

router.get('/signup',(req,res)=>{
  res.render('admin/admin-signup')
})


router.post('/admin-signup',(req,res)=>{
  productHelpers.adminSignup(req.body).then((response)=>{
    req.session.admin = response
    req.session.adminLoggedIn
    res.redirect('/admin')

  })
})

router.get('/admin-login',(req,res)=>{
  if(req.session.admin){
    res.redirect('/admin')
  }else{
    res.render('admin/admin-login')
  }

})

router.post('/admin-login',(req,res)=>{
  productHelpers.adminLogin(req.body).then((response)=>{
  if(response.status){
    req.session.admin=response.admin
    req.session.adminLoggedIn=true
    productHelpers.getAllproducts().then((products)=>{
      res.render('admin/view-products',{admin:true,products}) })
  }else{
    req.session.adminlogginErr='Invalid username or password'
    res.redirect('/admin-login')
  }
  })
})


router.get('/admin-logout',(req,res)=>{
  req.session.admin=null
  req.session.adminLoggedIn=false
  res.redirect('/admin/admin-login')
})

module.exports = router;
