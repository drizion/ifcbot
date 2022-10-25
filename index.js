import makeWASocket, { DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, BufferJSON, useMultiFileAuthState  } from '@adiwajshing/baileys'
import * as fs from 'fs'
import P from 'pino'
import setMediaType from './lib/setMediaType.js'
import start from './src/commands/start.js'
import conhecer from './src/commands/conhecer.js'
import integrado from './src/commands/integrado.js'
import local from './src/commands/local.js'
import criador from './src/commands/criador.js'
import voltarAoMenu from './src/commands/voltarAoMenu.js'
import horario from './src/commands/horario.js'
import orientador from './src/commands/orientador.js'
import superior from './src/commands/superior.js'

const dic = JSON.parse(fs.readFileSync('./lib/dictionary.json'))
const prefix = dic.config.prefix
const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) })

store.readFromFile('./session/baileys_store_multi.json')
setInterval(() => {
    store.writeToFile('./session/baileys_store_multi.json')
}, 10_000)

const { state, saveCreds } = await useMultiFileAuthState('baileys_auth_info')

const startSock = async () => {
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)
    const sock = makeWASocket["default"]({
        version,
        logger: P({
            level: 'fatal'
        }),
        printQRInTerminal: true,
        auth: state
    })
    store.bind(sock.ev)
    //
    sock.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if(connection === 'close') {
			if((lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
				startSock()
			} else {
				console.log('Connection closed. You are logged out.')
			}
		}
		console.log('connection update', update)
	})
    //
    sock.ev.on('creds.update', saveCreds)
    //
    sock.ev.on('messages.upsert', async m => {
        try {
            if (m.type !== 'notify') return
            const msg = m.messages[0]
            const from = msg.key.remoteJid
            const MediaType = setMediaType(msg.message)
            const sender = msg.key.participant?.split(":")[0] || msg.key.remoteJid
            const ownerNumber = "555190052219@s.whatsapp.net"
            const isOwner = sender.includes(ownerNumber) || false
            const isGroup = from.endsWith('@g.us')
            const { body } = MediaType
            const reply = async (message) => {
                await sock.sendMessage(from, {
                    text: message
                }, {
                    quoted: msg
                })
            }
            
            if (body.startsWith(prefix)) {
                const command = body.slice(1).trim().split(' ')[0].toLowerCase()
                switch (command) { // commands
                    case '':
                        break
                    case 'oi':
                    case 'start':
                    case 'comecar':
                    case 'começar':
                        start(sock, from, prefix)    
                    break
                    case 'conhecer':
                        conhecer(sock, from, prefix)
                    break
                    case 'integrado':
                        integrado(sock, from, prefix)
                    break
                    case 'superior':
                        superior(sock, from, prefix)
                    break
                    case 'local':
                        await local(sock, from, prefix)  
                        await voltarAoMenu(sock, from, prefix)  
                    break
                    case 'criador':
                        criador(sock, from, prefix)    
                    break
                    case 'orientador':
                        orientador(sock, from, prefix)
                    break
                    case 'horario':
                        horario(sock, from, prefix)
                    break
                    case 'msg':
                        if (!isOwner) return
                        await sock.sendMessage(from, {
                            text: JSON.stringify(msg, null, 2)
                        })
                        break
                    case 'status':
                        await sock.sendMessage(from, {
                            text: JSON.stringify(MediaType, null, 2)
                        })
                        break
                    default:
                        await sock.sendMessage(from, {
                            text: `desculpe, o comando ${prefix}${command} não existe...`
                        })
                        break
                }
                console.log(`[cmd]: (${command}) | ${body} | ${sender}`)
            } else {
                if (body !== '') {
                    console.log(`[msg]: ${body} | ${sender.replace('@s.whatsapp.net','')}`)
                }
            }
        } catch (e) {
            console.log('error: ' + e)
        }
    })
    return sock
}

startSock()