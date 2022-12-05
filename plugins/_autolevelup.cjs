var level = require('../lib/levelling.cjs');
var handler = m => m
handler.before = m => {
	var user = db.data.users[m.sender]
	if (!user.autolevelup)
		return !0
	if (!m.text)
		return !0
	var before = user.level * 1
	while (level.canLevelUp(user.level, user.exp, global.multiplier))
		user.level++

	if (before !== user.level) {
		user.role = global.rpg.role(user.level).name
		m.reply(`
Selamat, ${conn.getName(m.sender)} telah naik level!
• 🧬Level Sebelumnya : ${before}
• 🧬Level Baru : ${user.level}
• 🧬Role Kamu : ${user.role}
*.disable autolevelup* untuk mematikan autolevelup 
gunakan *.inventory* untuk mengecek
	`.trim())
	}
}
handler.disabled = false
module.exports = handler
