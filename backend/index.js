import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from "cors";

const app = express();
const port = 3000
const prisma = new PrismaClient()

app.use(cors());

app.get('/categories', async (req, res) => {
    const categories = await prisma.products.findMany({
        select: {
            type: true,
        },
        distinct: ["type"],
        orderBy: {
            "type": "asc"
        }
    })
    res.send(categories.map(cat => cat.type));
})

app.get("/products", async (req, res) => {
    const category = req.query.category;
    const page = parseInt(req.query.page);
    const searchQuery = req.query.search;
    const skip = 20 * (page - 1);
    let products;
    if (searchQuery) {
        products = await prisma.products.findMany({
            select: {
                name: true,
                price: true,
                type: true,
            },
            where: {
                name: {
                    contains: searchQuery,
                    mode: "insensitive",
                }
            },
            skip: skip,
            take: 20,
        })
    } else {
        products = await prisma.products.findMany({
            select: {
                name: true,
                price: true,
                type: true,
            },
            where: {
                type: category || "",
            },
            skip: skip,
            take: 20,
        });
    }
    res.send(products.map(product => {
        product.price = product.price.toFixed(2);
        return product;
    }));
})

app.get("/numpages", async (req, res) => {
    let products;
    if (req.query.category) {
        products = await prisma.products.findMany({
            where: {
                type: req.query.category
            }
        });
    } else {
        products = await prisma.products.findMany({
            where: {
                name: {
                    contains: req.query.search,
                    mode: "insensitive",
                }
            }
        });
    }
    const numProducts = products.length;
    const numPages = Math.ceil(numProducts / 20);
    res.send(numPages.toString());
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})