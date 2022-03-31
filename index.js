import { Boom } from '@hapi/boom'
import P from 'pino'
import makeWASocket, { delay, getContentType, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
import * as fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import { exec } from 'child_process'

const store = makeInMemoryStore({ logger: P().child({ level: 'error', stream: 'store' }) })
store.readFromFile('./baileys_store_multi.json')
// save every 10s
setInterval(() => {
	store.writeToFile('./baileys_store_multi.json')
}, 10_000)


const prefix = "#"
const { state, saveState } = useSingleFileAuthState('./auth_info_multi.json')

// start a connection
const startSock = async() => {
	// fetch latest version of WA Web
	const { version, isLatest } = await fetchLatestBaileysVersion()
	console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)

	const sock = makeWASocket["default"]({
		version,
		logger: P({ level: 'error' }),
		printQRInTerminal: true,
		auth: state
	})
	store.bind(sock.ev)
	

	sock.ev.on('messages.upsert', async m => {
		
		try {
            const msg = m.messages[0] // last message
            const sMsg = JSON.stringify(msg,null,2) // stringified message
            const from = msg.key.remoteJid // chat id
			const isGroup = from.endsWith('@g.us')
            const ownerNumber = "555190052219@s.whatsapp.net"
			const sender = msg.key.participant || msg.key.remoteJid
            const isOwner = sender.includes(ownerNumber) || false

            var body = ''
            if (m.type === 'notify') {
                const type = getContentType(msg.message) // get message type and format body
                const messageType = Object.keys(msg.message)[0]
                    let isMediaType = ''
                const isMedia = (type === 'imageMessage' || type === 'videoMessage')
                    if(isMedia){ isMediaType = "0" }
                const isQuotedImage = type === 'extendedTextMessage' && sMsg.includes('imageMessage')
                    if(isQuotedImage){ isMediaType = "1" }
                const isQuotedVideo = type === 'extendedTextMessage' && sMsg.includes('videoMessage')
                    if(isQuotedVideo){ isMediaType = "2" }
                const isQuotedSticker = type === 'extendedTextMessage' && sMsg.includes('stickerMessage')
                    if(isQuotedSticker) { isMediaType = "3"}
                const isQuotedAudio = type === 'extendedTextMessage' && sMsg.includes('audioMessage')
                    if(isQuotedAudio){ isMediaType = "4" }
                switch(type){
                    case 'conversation':
                        body += msg.message?.conversation
                    break
                    case 'imageMessage':
                        body += msg.message?.imageMessage?.caption
                    break
                    case 'videoMessage':
                        body += msg.message?.videoMessage?.caption
                    break
                    case 'extendedTextMessage':
                        body += msg.message?.extendedTextMessage?.text
                    break
                    case 'buttonsResponseMessage':
                        body += msg.message?.buttonsResponseMessage?.selectedButtonId
                    break
                    case 'liveLocationMessage':
                        body += msg.message?.liveLocationMessage?.caption
                    break
                    case 'listResponseMessage':
                        body += msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId
                    break
                    default:
                    break
                }
                
                // if is a command
                if(body.startsWith(prefix)){
                    const command =  body.slice(1).trim().split(' ')[0].toLowerCase()
                    switch(command){ // commands
                        case '':
                        break
                        case 'menu':
                            await sock.sendMessage(from, { text: 'bem vindo ao menu!\n\nessa é a versão de testes da próxima atualização do wabot.net\n\naté o momento, o único comando funcionando é #fig' })
                        break
                        case 'add':
                            console.log("command add")
                        break
                        case 'msg':
                            if(!isOwner) return
                            await sock.sendMessage(from, { text: JSON.stringify(msg,null,2)})                
                        break
                        case 'status':
                            let obj = {
                                "isMedia": isMedia,
                                "isQuotedImage": isQuotedImage,
                                "isQuotedVideo": isQuotedVideo,
                                "isQuotedAudio": isQuotedAudio,
                                "isQuotedSticker": isQuotedSticker,
                                "isOwner": isOwner
                            }
                            await sock.sendMessage(from, { text: JSON.stringify(obj,null,2)})
                        break
                        default:
                            await sock.sendMessage(from, { text: `desculpe, o comando ${prefix}${command} não existe...`})
                        break
                    }
                    console.log(`[cmd]: (${command}) | ${body} | ${sender}`)
                } else {
                    if(body === '') return
                    console.log(`[msg]: ${body} | ${sender.replace('@s.whatsapp.net','')}`)
                }
            }
        } catch (e) {
            console.log('error: ' + e)
        }

	})

	sock.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if(connection === 'close') {
			// reconnect if not logged out
			if((lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
				startSock()
			} else {
				console.log('Connection closed. You are logged out.')
			}
		}
        
		console.log('connection update', update)
	})
	// listen for when the auth credentials is updated
	sock.ev.on('creds.update', saveState)

	return sock
}

startSock()