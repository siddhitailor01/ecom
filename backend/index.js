const express = require("express");
const cors = require("cors");
require('./db/config');
const user = require("./db/user");
const Product = require("./db/Product")

const Jwt = require("jsonwebtoken")
const jwtKey = 'e-comm';

const app = express();

app.use(cors());
app.use(express.json());  //Postman ka data fatch krne ke liye 
app.post("/register", async (req, res) => {
    let User = new user(req.body);
    let result = await User.save();
    result = result.toObject();
    delete result.password

    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
            res.send({ result: "Something went wrong , please try after sometime" })
        }
        res.send({ result, auth: token })
    })
})



app.post("/login", async (req, res) => {
    console.log(req.body)
    if (req.body.password && req.body.email) {
        let User = await user.findOne(req.body).select("-password");
        if (User) {
            Jwt.sign({ User }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    res.send({ result: "Something went wrong , please try after sometime" })
                }
                res.send({ User, auth: token })
            })
            res.send(User)
        }
        else {
            res.send({ result: 'No user Found' })
        }
    }
    else {
        res.send({ result: 'No user Found' })

    }


})

app.post("/add-product", async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result)
})

///////////PRODUCTS ko fetch krne ke liye API /////////////////

app.get("/products", async (req, res) => {
    let products = await Product.find();
    if (products.length > 0) {
        res.send(products)
    }
    else {
        res.send({ result: "No Products Found" })
    }
})

app.delete("/product/:id", async (req, res) => {
    const result = await Product.deleteOne({ _id: req.params.id })
    res.send(result);
});

app.get("/product/:id", async (req, res) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        res.send(result)
    }
    else {
        res.send("No record found")
    }
})

app.put("/product/:id", async (req, res) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    res.send(result)
});


app.get("/search/:key", verifyToken, async (req, res) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { company: { $regex: req.params.key } },
            { category: { $regex: req.params.key } }


        ]
    });
    res.send(result)
})

function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split('')[1];
        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                res.status(401).send({ result: "Please Provide valid token" })
            }
            else {
                next();
            }
        })
    }
    else {
        res.status(403).send({ result: "Please add token with header" })
    }
    next();
}


app.listen(5000)