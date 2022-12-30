import { horarioEM } from "../../lib/ifc.js"

export default async(sock, from, prefix) => {
    // horarioEM().then(async (horario) => {
        const buttons = [
            {buttonId: `${prefix}conhecer`, buttonText: {displayText: 'Voltar'}, type: 1}
        ]
        
        const buttonMessage = {
            text: `O horário atualizado do ensino médio do IFC-CAS está disponível no link abaixo:\nhttps://docs.google.com/spreadsheets/d/e/2PACX-1vSTiNBKTBcj-1uF_KW9K2mqXD-RfzsRi2T-G_hT5KgB-5iA_3q9Ymk0jzuGq8zv5pI7B86HRdciZ_lG/pubhtml`,
            footer: '[Assistente do IFC-CAS]',
            buttons: buttons,
            headerType: 1
        }
        await sock.sendMessage(from, buttonMessage)
    // }).catch(err => {
    //     sock.sendMessage(from, {
    //         text: "Algo deu errado ao buscar o horário do ensino médio... tente novamente mais tarde."
    //     })
    //     console.log(err);
    // })
}