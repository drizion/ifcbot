import P from 'pino'
import makeWASocket, { delay, getContentType, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
import setMediaType from './lib/setMediaType.js'
const prefix = "#"

const store = makeInMemoryStore({ logger: P().child({ level: 'error', stream: 'store' }) })
store.readFromFile('./store/baileys_store_multi.json')
    setInterval(() => {
	    store.writeToFile('./store/baileys_store_multi.json')
    }, 10_000)

const { state, saveState } = useSingleFileAuthState('./auth/auth_info_multi.json')

const startSock = async() => {
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
            if (m.type !== 'notify') return
            const msg = m.messages[0] // last message
            const sMsg = JSON.stringify(msg,null,2) // stringified message
            const from = msg.key.remoteJid // chat id
			const isGroup = from.endsWith('@g.us')
            const ownerNumber = "555190052219@s.whatsapp.net"
			const sender = msg.key.participant || msg.key.remoteJid
            const isOwner = sender.includes(ownerNumber) || false
            const MediaType = setMediaType(msg.message)
            const body = MediaType.body
            const isMedia = MediaType.isMedia
            const isQuotedImage = MediaType.isQuotedImage
            const isQuotedVideo = MediaType.isQuotedVideo
            const isQuotedAudio = MediaType.isQuotedAudio
            const isQuotedSticker = MediaType.isQuotedSticker
            const isMediaType = MediaType.isMediaType
            // if is a command
            if(body.startsWith(prefix)){
                const command =  body.slice(1).trim().split(' ')[0].toLowerCase()
                switch(command){ // commands
                    case '':
                    break
                    case 'oi':
                        var sections = [
                            {
                            title: "Sobre o Campus",
                            rows: [
                                {title: "Localização", rowId: `${prefix}local`, description: "Como chegar até o campus?"}
                            ]
                            },
                           {
                            title: "Desenvolvedores",
                            rows: [
                                {title: "Criador", rowId: `${prefix}criador`, description: "Conheça o aluno desenvolvedor do assistente."},
                                {title: "Orientador", rowId: `${prefix}orientador`, description: "Conheça o orientador do projeto."}
                            ]
                            },
                        ]
                        await sock.sendMessage(from, {
                            text: "Olá! Sou um assistente virtual, como posso te ajudar?",
                            footer: "https://sombrio.ifc.edu.br",
                            title: "[Assistente do IFC-CAS]",
                            buttonText: "Saiba mais",
                            sections
                        })
                    break
                    case 'local':
                        await sock.sendMessage(
                            from, {
                                text: "O Instituto Federal Catarinense - Campus Avançado Sombrio está localizado na Av. Pref. Francisco Lumertz Júnior, 931 - Januária, Sombrio - SC, 88960-000\n\nVocê também pode encontrá-lo clicando na localização abaixo:"
                            }
                        )
                        await sock.sendMessage(
                            from, 
                            { location: { degreesLatitude: -29.1018802, degreesLongitude: -49.6385941 } }
                        )
                    break
                    case 'criador':
                        var templateButtons = [
                            {index: 1, urlButton: {displayText: '⭐ Siga no Instagram!', url: 'https://instagram.com/gabriel.da.silva_'}},
                            {index: 2, quickReplyButton: {displayText: 'Voltar ao menu', id: `${prefix}oi`}},
                        ]
                        await sock.sendMessage(from, {
                            text: "Siga o bolsista desenvolvedor do projeto!",
                            footer: "https://sombrio.ifc.edu.br",
                            templateButtons: templateButtons
                        })
                    break
                    case 'orientador':
                        var templateButtons = [
                            {index: 1, urlButton: {displayText: '⭐ Linkedin', url: 'https://br.linkedin.com/in/matheuslbraga'}},
                            {index: 2, quickReplyButton: {displayText: 'Voltar ao menu', id: `${prefix}oi`}},
                        ]
                        await sock.sendMessage(from, {
                            text: "Conheça o orientador do projeto!",
                            footer: "https://sombrio.ifc.edu.br",
                            templateButtons: templateButtons
                        })
                    break
                    case 'msg':
                        if(!isOwner) return
                        await sock.sendMessage(from, { text: JSON.stringify(msg,null,2)})                
                    break
                    case 'status':
                        await sock.sendMessage(from, { text: JSON.stringify(MediaType,null,2)})
                    break
                    default:
                        await sock.sendMessage(from, { text: `desculpe, o comando ${prefix}${command} não existe...`})
                    break
                }
                console.log(`[cmd]: (${command}) | ${body} | ${sender}`)
            } else {
                if(body !== '') {
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
		sock.ev.on('creds.update', saveState)
	return sock
}

startSock()