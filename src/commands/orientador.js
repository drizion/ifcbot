export default async(sock, from, prefix) => {
    const buttons = [
        {buttonId: `${prefix}conhecer`, buttonText: {displayText: 'Voltar'}, type: 1}
    ]
    
    const buttonMessage = {
        text: "Conheça o orientador do projeto!\n\nLinkedin: Matheus Lorenzato Braga\nhttps://br.linkedin.com/in/matheuslbraga",
        footer: '[Assistente do IFC-CAS]',
        buttons: buttons,
        headerType: 1
    }
    
    await sock.sendMessage(from, buttonMessage)
}