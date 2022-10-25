export default async(sock, from, prefix) => {
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
        },
        {
            title: "Navegação",
            rows: [{
                title: "Voltar",
                rowId: `${prefix}start`,
                description: "Quero voltar ao menu inicial."
            }]
        }
    ]
    await sock.sendMessage(from, {
        text: "Okay, Vamos conhecer o campus!\nPosso te mostrar informações sobre localização, diretoria, processos seletivos, dentre muitas outras coisas :)",
        footer: "Escolha uma opção abaixo:",
        title: "[Assistente do IFC-CAS]",
        buttonText: "Ver opções",
        sections
    })
}