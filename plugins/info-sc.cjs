var handler = async(m, { conn, text, usedPrefix, command }) => {

var str = `\n\nhttps://github.com/FahriAdison/Sad-Bot-V2`
conn.sendButtonDoc(m.chat, str, wm, 'Oke','Bilek', ftextt, m)
}
handler.command = handler.help = ['sc']
handler.tags = ['info']
    
module.exports = handler
