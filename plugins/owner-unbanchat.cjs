var handler = async (m) => {
	db.data.chats[m.chat].isBanned = true
	m.reply('Done!')
}
handler.help = ['unbanchat']
handler.tags = ['owner']
handler.command = /^unbanchat$/i
handler.owner = true

module.exports = handler
