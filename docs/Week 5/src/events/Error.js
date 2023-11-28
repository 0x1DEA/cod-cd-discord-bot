const {Events} = require("discord.js");

module.exports = {
    event: Events.Error,
    run: err => console.log(err.message)
}