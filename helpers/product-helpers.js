var db = require('../config/connection')
var collection = require('../config/collections')
const Promise = require('promise')
const { response } = require('express')
var objectId = require('mongodb').ObjectID
const bcrypt = require('bcrypt')

module.exports = {

    addProduct: (product, callback) =>{
         db.get().collection('product').insertOne(product).then((data) => {
         callback(data.ops[0]._id)

        })

    },
    getAllproducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLLECTION).find().toArray()
            resolve(products)
        })
    },
    deleteProduct: (proId) => {
        return new Promise((resolve, reject) => {
            console.log(proId)
            console.log(objectId(proId))
            db.get().collection(collection.PRODUCT_COLLLECTION).removeOne({ _id: objectId(proId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getProductDetailes: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLLECTION).findOne({ _id: objectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },
    updateProduct:(proId, proDetailes) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLLECTION)
                .updateOne({ _id: objectId(proId) }, {
                    $set: {
                        Name: proDetailes.Name,
                        Description: proDetailes.Description,
                        Price: proDetailes.Price,
                        Category: proDetailes.Category
                    }
                }).then((response) => {
                    resolve()
                })
        })
    },
    adminSignup: (userData) =>{
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(userData).then((data) =>{
                resolve(data.ops[0])


            })


        })

    },
    adminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.Email })
            if (admin) {
                bcrypt.compare(adminData.Password, admin.Password).then((status) => {
                    if (status) {
                        console.log('login success')
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('login failed')
                        resolve({ status: false })
                    }

                })
            } else {
                console.log('login failed')
                resolve({ status: false })
            }
        })
    }
}