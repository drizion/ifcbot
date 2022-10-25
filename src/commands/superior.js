export default async(sock, from, prefix) => {
    const buttons = [
        {buttonId: `${prefix}conhecer`, buttonText: {displayText: 'Voltar'}, type: 1}
    ]
    
    const buttonMessage = {
        text: "O IFC-CAS conta com os seguintes cursos de Ensino Superior:\n\n • Licenciatura em Matemática\nhttps://matematica.sombrio.ifc.edu.br/\n\n • Tecnologia em Gestão de Turismo\nhttps://turismo.sombrio.ifc.edu.br/\n\n • Tecnologia em Redes de Computadores\nhttps://redes.sombrio.ifc.edu.br/",
        footer: '[Assistente do IFC-CAS]',
        buttons: buttons,
        headerType: 1
    }
    
    await sock.sendMessage(from, buttonMessage)
}