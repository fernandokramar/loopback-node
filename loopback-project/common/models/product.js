'use strict';

module.exports = function(Product) {
//custom methods

    Product.customMethod = function(cb){
        cb(null, 'my first cusyom method')
    }

    Product.remoteMethod('customMethod', {
        returns: {
            arg:'response',
            type:'string'
        },
        http: {
            path:'/custom', //GET http://localhost:3000/api/products/custom    retorna o customMethod
            verb:'get'
        }
    })

    Product.byTotal = function(cb){
        // Product.destroyById(id, cb)
        // Product.updateAll({}, {}, cb)
        // Product.create({}, cb)
        // Product.find({}, cb)
        // Product.findById(id, cb)
        Product.find({}, function(err, data) {
                if (err) cb(err)
                if(!data) cb(null, {})

                const getQtd = function (product){
                    return product.qtd
                }

                const sumQtd = function(qtdPrev, qtdNext){
                    return qtdPrev + qtdNext
                }

               let total = data.map(getQtd).reduce(sumQtd)

               cb(null, { total })
            })
    } 

    Product.remoteMethod('byTotal', {
        returns: {
            arg:'response',
            type:'object'
        },
        http: {
            path:'/total', //GET http://localhost:3000/api/products/total   retorna o product.byTotal
            verb:'get'
        }
    })


//hooks
    Product.beforeRemote('byTotal', function(context, product, next) {
        console.log('terminal -> Before Remote Hook applied')

        next()
    })
    Product.afterRemote('byTotal', function(context, product, next) {
        console.log('terminal -> After Remote Hook applied')

        next()
    })

//hooks action model 
    Product.observe('before save', function(ctx, next){
        console.log('Before savings...', ctx.instance)

        next()
    })
};
