const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

const sqliteConnection = require("../database/sqlite")
const knex = require("../database/knex")


class UsersController {
    async create(request, response) {
        const { name, email, password } = request.body

        const database = await sqliteConnection()

        const checkUserWExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkUserWExists){
            throw new AppError("This email is already in use.")
        }

        const hashedPassword = await hash(password, 8)

        await database.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]
        )

        response.status(201).json({name, email, hashedPassword})
    }

    async index(request, response) {
    
        const database = await sqliteConnection()

        const allUsers = await knex("users")

        response.status(200).json(allUsers)
    }

    async show(request, response) {
        const { id } = request.params
    
        const database = await sqliteConnection()

        const selectedUser = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        response.status(200).json(selectedUser)
    }

    async update(request, response) {
        const { name, email, old_password, password=old_password } = request.body
        const { id } = request.params
    
        const database = await sqliteConnection()


        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

        if (!user){
            throw new AppError("User not found!")
        }


        const userEmailUpdated = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if (userEmailUpdated && userEmailUpdated.id !== user.id){
            throw new AppError("Email already in use.")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email


        if ( password && !old_password) {
            throw new AppError("You need to inform the old password.")
        }

        const checkOldPassword = await compare(old_password, user.password)

        if (!checkOldPassword){
            throw new AppError("Old password does not match.")
        }


        const hashedPassword = await hash(password, 8)




        await database.run(
            `UPDATE users SET name = ?, email = ?, password = ?, updated_at = DATETIME('now') WHERE id = ?`,
            [user.name, user.email, hashedPassword, id]
        )

        return response.status(201).json({id, name, email, password, hashedPassword})
    }

    async delete(request, response) {
        const { id } = request.params
    
        const database = await sqliteConnection()

        await database.run("DELETE FROM users WHERE id = (?)", [id])

        response.status(200).json({msg: "User deleted."})
    }
}


module.exports = UsersController