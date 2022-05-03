import makeWASocket, { delay, getContentType, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, useSingleFileAuthState } from '@adiwajshing/baileys'
import * as fs from 'fs'
import P from 'pino'
import setMediaType from './lib/setMediaType.js'
import { horarioEM } from './lib/ifc.js'

const dic = JSON.parse(fs.readFileSync('./lib/dictionary.json'))
const prefix = dic.config.prefix
const store = makeInMemoryStore({
    logger: P().child({
        level: 'error',
        stream: 'store'
    })
})
store.readFromFile('./session/baileys_store_multi.json')
setInterval(() => {
    store.writeToFile('./session/baileys_store_multi.json')
}, 10_000)

const { state, saveState } = useSingleFileAuthState('./session/auth_info_multi.json')

const startSock = async () => {
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join('.')}, isLatest: ${isLatest}`)
    const sock = makeWASocket["default"]({
        version,
        logger: P({
            level: 'error'
        }),
        printQRInTerminal: true,
        auth: state
    })
    store.bind(sock.ev)
    //
    //
    sock.ev.on('messages.upsert', async m => {
        try {
            if (m.type !== 'notify') return
            const msg = m.messages[0]
            const sMsg = JSON.stringify(msg, null, 2)
            const from = msg.key.remoteJid
            const MediaType = setMediaType(msg.message)
            const sender = msg.key.participant?.split(":")[0] || msg.key.remoteJid
            const ownerNumber = "555190052219@s.whatsapp.net"
            const isOwner = sender.includes(ownerNumber) || false
            const isGroup = from.endsWith('@g.us')
            const { body, isMedia, isQuotedAudio, isQuotedImage, isQuotedSticker, isQuotedVideo, isMediaType } = MediaType
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
                        var sections = [
                            {
                                title: "Sobre o Campus",
                                rows: [{
                                    title: "Sobre o IFC-CAS",
                                    rowId: `${prefix}conhecer`,
                                    description: "Quero conhecer o IFC-CAS"
                                }]
                            },
                            {
                                title: "Ensino Médio",
                                rows: [{
                                    title: "Horário",
                                    rowId: `${prefix}horario`,
                                    description: "Horário do Ensino Médio atualizado."
                                }]
                            },
                            {
                                title: "Desenvolvedores",
                                rows: [{
                                        title: "Criador",
                                        rowId: `${prefix}criador`,
                                        description: "Conheça o aluno desenvolvedor do assistente."
                                    },
                                    {
                                        title: "Orientador",
                                        rowId: `${prefix}orientador`,
                                        description: "Conheça o orientador do projeto."
                                    }
                                ]
                            },
                        ]
                        await sock.sendMessage(from, {
                            text: "Olá! Sou um assistente virtual, como posso te ajudar?",
                            footer: "Escolha uma opção abaixo:",
                            title: "[Assistente do IFC-CAS]",
                            buttonText: "Ver opções",
                            sections
                        })
                        break
                    case 'conhecer':
                        var sections = [
                            {
                                title: "Localização",
                                rows: [{
                                    title: "Onde fica o campus?",
                                    rowId: `${prefix}local`,
                                    description: "Ver localização do IFC-CAS"
                                }]
                            },
                            {
                                title: "Processo Seletivo",
                                rows: [{
                                        title: "Ensino Médio + Curso Técnico",
                                        rowId: `${prefix}integrado`,
                                        description: "Quero conhecer os cursos técnicos integrados ao Ensino Médio."
                                    },
                                    {
                                        title: "Ensino Superior",
                                        rowId: `${prefix}superior`,
                                        description: "Quero conhecer os cursos superiores."
                                    }
                                ]
                            }
                        ]
                        await sock.sendMessage(from, {
                            text: dic.conhecer.geral,
                            footer: "Escolha uma opção abaixo:",
                            title: "[Assistente do IFC-CAS]",
                            buttonText: "Ver opções",
                            sections
                        })
                    break
                    case 'integrado':
                        var templateButtons = [{
                            index: 1,
                            urlButton: {
                                displayText: 'Portal de Ingresso 🟢',
                                url: 'https://ingresso.ifc.edu.br/category/tecnico-integrado/'
                            }
                        },
                        {
                            index: 2,
                            urlButton: {
                                displayText: 'Provas Anteriores 🔴',
                                url: 'https://ingresso.ifc.edu.br/category/tecnico-integrado/provas-anteriores/'
                            }
                        },
                        {
                            index: 3,
                            quickReplyButton: {
                                displayText: 'Voltar ao menu',
                                id: `${prefix}oi`
                            }
                        },
                    ]
                    await sock.sendMessage(from, {
                        text: dic.conhecer.processoseletivo.integrado,
                        footer: "https://sombrio.ifc.edu.br",
                        templateButtons: templateButtons
                    })
                    break
                    case 'superior':
                        reply("em breve mais informações aqui")
                    break
                    case 'local':
                        await sock.sendMessage(
                            from, {
                                text: dic.conhecer.local
                            }
                        )
                        await sock.sendMessage(
                            from, {
                                location: {
                                    degreesLatitude: -29.1018802,
                                    degreesLongitude: -49.6385941
                                }
                            }
                        )
                        break
                    case 'criador':
                        var templateButtons = [{
                                index: 1,
                                urlButton: {
                                    displayText: 'Siga no Instagram! ⭐',
                                    url: 'https://instagram.com/gabriel.da.silva_'
                                }
                            },
                            {
                                index: 2,
                                quickReplyButton: {
                                    displayText: 'Voltar ao menu',
                                    id: `${prefix}oi`
                                }
                            },
                        ]
                        await sock.sendMessage(from, {
                            text: "Siga o bolsista desenvolvedor do projeto!",
                            footer: "https://sombrio.ifc.edu.br",
                            templateButtons: templateButtons
                        })
                        break
                    case 'orientador':
                        var templateButtons = [{
                                index: 1,
                                urlButton: {
                                    displayText: 'Linkedin ⭐',
                                    url: 'https://br.linkedin.com/in/matheuslbraga'
                                }
                            },
                            {
                                index: 2,
                                quickReplyButton: {
                                    displayText: 'Voltar ao menu',
                                    id: `${prefix}oi`
                                }
                            },
                        ]
                        await sock.sendMessage(from, {
                            text: "Conheça o orientador do projeto!",
                            footer: "https://sombrio.ifc.edu.br",
                            templateButtons: templateButtons
                        })
                        break
                    case 'horario':
                        horarioEM().then(async (horario) => {
                            var templateButtons = [{
                                    index: 1,
                                    urlButton: {
                                        displayText: 'Ver horário atualizado ⭐',
                                        url: horario
                                    }
                                },
                                {
                                    index: 2,
                                    quickReplyButton: {
                                        displayText: 'Voltar ao menu',
                                        id: `${prefix}oi`
                                    }
                                },
                            ]
                            await sock.sendMessage(from, {
                                text: "Olá! O horário mais atualizado para os cursos técnicos integrados se encontra no botão abaixo",
                                footer: "https://sombrio.ifc.edu.br",
                                templateButtons: templateButtons
                            })
                        })
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

    sock.ev.on('connection.update', (update) => {
        const {
            connection,
            lastDisconnect
        } = update
        if (connection === 'close') {
            if ((lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
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