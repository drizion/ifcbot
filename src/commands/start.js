export default async(sock, from, prefix) => {
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
}