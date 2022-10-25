export default async(sock, from, prefix) => {
    const buttons = [
        {buttonId: `${prefix}conhecer`, buttonText: {displayText: 'Voltar'}, type: 1}
    ]
    
    const buttonMessage = {
        text: "Precisa de mais alguma ajuda?",
        footer: '[Assistente do IFC-CAS]',
        buttons: buttons,
        headerType: 1
    }

    await sock.sendMessage(from, buttonMessage)
}