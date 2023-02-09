const cors = require("cors")
// import cors from 'cors'
const express = require("express")
const stripe = require ("stripe")("sk_test_51MZbYTECNC7l2I8KO3gkbpqPUf34PKLRygjCVCaji5Su0Llq8uoQICiiuYKAC8qoeoynyTBge2ZXM9t307l7Sgkp004HQAM1pH")
const uuid = require ("uuid")
const port = 8080


const app = express()
app.use(express.json)
app.use(cors())
 app.get("/",(req,res)=>{
    res.send("it works at")
 })


 app.post("/payment",(req,res)=>{
    const {product,token } = req.body
    console.log("Product",product)
    console.log("PRICE",product.price)
    // idempontencyKey creating unique key and no user can be charged twice for the same product
    const idempontencyKey = uuid()

    return stripe.customer.create({
        email:token.email,
        source :token.id
    }).then(customer=>{
        stripe.charges.create({
            amount :product.price *100,
            currency:"usd",
            customer:customer.id,
            reciept_email:token.email,
            description:`purchase of product.name`,
            shipping:{
                name:token.card.name,
                address:{
                     country :token.card.address_country
                }
            }

        },idempontencyKey)
    }).then(result=>res.status(200).json(result)
)
.catch(err=>console.log(err))
 })



app.listen(port,()=>{
    console.log(`listening on ${port}`)
})

