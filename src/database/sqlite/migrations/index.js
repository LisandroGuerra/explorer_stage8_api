const sqliteConnection = require("../../sqlite")
const createUsersTable = require("./createUsersTable")


async function migrationsRun(){
    const schemas = [
        createUsersTable
    ].join('')

    sqliteConnection()
        .then(db => db.exec(schemas))
        .catch(error => console.error(error))
}


module.exports = migrationsRun