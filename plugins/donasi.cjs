var handler = async m => m.reply(`
Silahkan donasi ke yang lebih membutuhkan di link /nhttps://kitabisa.com 😻
`.trim()) // Tambah sendiri kalo mau
handler.help = ['donasi']
handler.tags = ['info']
handler.command = /^dona(te|si)$/i

module.exports = handler
