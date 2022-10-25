export default async(sock, from, prefix) => {
    const buttons = [
        {buttonId: `${prefix}conhecer`, buttonText: {displayText: 'Voltar'}, type: 1}
    ]
    
    const buttonMessage = {
        text: "O IFC-CAS conta com os seguintes Cursos Técnicos Integrados ao Ensino Médio:\n\n • Técnico em Informática para Internet\nhttps://internet.sombrio.ifc.edu.br/\n\n • Técnico em Hospedagem\nhttps://hospedagem.sombrio.ifc.edu.br/\n\n • Provas Anteriores\nhttps://ingresso.ifc.edu.br/category/tecnico-integrado/provas-anteriores/",
        footer: '[Assistente do IFC-CAS]',
        buttons: buttons,
        headerType: 1
    }
    
    await sock.sendMessage(from, buttonMessage)
}