const knex = require("../database/knex")


class TagsController {
    async show (request, response){
        const { user_id } = request.params

        const tags = await knex("tags").where({ user_id })

        return response.json(tags)
    }

    async index (request, response){

        const tags = await knex("tags")

        return response.json(tags)
    }
}



module.exports = TagsController