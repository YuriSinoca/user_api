
const express = require('express')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()
app.use(express.json())


//Rota para retornar todos os usuários
app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany()
    res.json(users)
})



// Rota para criar usuários 
app.post("/users", async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name e email são obrigatorio" })
    }

    const user = await prisma.user.create({
        data: {
            name,
            email
        }
    })

    res.status(201).json(user)
})



//Rota para busca um usúario pelo ID
app.get("/user/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" })
    }

    res.json(user)
})

//Rota para deletar um usuário pelo ID
app.delete("/user/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({ where: { id } })

    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" })
    }

    await prisma.user.delete({
        where: {id}
    })

    res.status(204).send()
})


//Rota para atualizar o usuário pelo ID
app.put("/user/:id", async (req, res) => {
    const id = parseInt(req.params.id)
    const user = await prisma.user.findUnique({ 
        where: { id } 
    })  

    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado" })
    }
    const { name, email } = req.body

    const updatedUser = await prisma.user.update({
        where: {id},
        data: {
            name,
            email
        }
    })

    res.json(updatedUser)

})

app.listen(3000, () => {
    console.log("Sever is running on port 3000")
})