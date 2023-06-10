const { Router } = require("express")

const UsersController = require("../controllers/UsersController")

const usersRoutes = Router()


function firstMiddleware(request, response, next){
    console.log("You went through the middleware.")
    next()
}


const usersController = new UsersController()

usersRoutes.get("/", firstMiddleware, usersController.index)
usersRoutes.get("/:id", firstMiddleware, usersController.show)
usersRoutes.post("/", firstMiddleware, usersController.create)
usersRoutes.put("/:id", firstMiddleware, usersController.update)
usersRoutes.delete("/:id", firstMiddleware, usersController.delete)


module.exports = usersRoutes