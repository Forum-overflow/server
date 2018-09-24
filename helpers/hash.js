var bcrypt = require('bcrypt');

module.exports = {
	encrypt: function (password) {
		let salt = bcrypt.genSaltSync(Number(process.env.SALT))
		var hash = bcrypt.hashSync(password, salt)
		return hash
	},
	decrypt: function (password, hash) {
		let decrypt = bcrypt.compareSync(password, hash);
		return decrypt
	}
}