export default async(sock, from, prefix) => {
    await sock.sendMessage(
        from, {
            text: "O Instituto Federal Catarinense - Campus Avançado Sombrio está localizado na Av. Pref. Francisco Lumertz Júnior, 931 - Januária, Sombrio - SC, 88960-000\n\nVocê também pode encontrá-lo clicando na localização abaixo:"
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
}