export default async(sock, from, prefix) => {
    const buttons = [
        {buttonId: `${prefix}conhecer`, buttonText: {displayText: 'Voltar'}, type: 1}
    ]
    
    const buttonMessage = {
        text: "Siga o bolsista desenvolvedor do projeto!\n\nInstagram: @eu_drizion\nhttps://instagram.com/eu_drizion",
        footer: '[Assistente do IFC-CAS]',
        buttons: buttons,
        headerType: 1
    }
    
    await sock.sendMessage(from, buttonMessage)
}