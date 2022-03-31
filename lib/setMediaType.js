import { getContentType } from '@adiwajshing/baileys'
const setMediaType = (message) => {
    const type = getContentType(message)
        let isMediaType = ''
        let body = ''
        let sMsg = JSON.stringify(message)
    const isMedia = (type === 'imageMessage' || type === 'videoMessage')
        if(isMedia){ isMediaType = "0" }
    const isQuotedImage = type === 'extendedTextMessage' && sMsg.includes('imageMessage')
        if(isQuotedImage){ isMediaType = "1" }
    const isQuotedVideo = type === 'extendedTextMessage' && sMsg.includes('videoMessage')
        if(isQuotedVideo){ isMediaType = "2" }
    const isQuotedSticker = type === 'extendedTextMessage' && sMsg.includes('stickerMessage')
        if(isQuotedSticker) { isMediaType = "3"}
    const isQuotedAudio = type === 'extendedTextMessage' && sMsg.includes('audioMessage')
        if(isQuotedAudio){ isMediaType = "4" }
    switch(type){
        case 'conversation':
            body += message.conversation
        break
        case 'imageMessage':
            body += message.imageMessage?.caption
        break
        case 'videoMessage':
            body += message.videoMessage?.caption
        break
        case 'extendedTextMessage':
            body += message.extendedTextMessage?.text
        break
        case 'buttonsResponseMessage':
            body += message.buttonsResponseMessage?.selectedButtonId
        break
        case 'liveLocationMessage':
            body += message.liveLocationMessage?.caption
        break
        case 'listResponseMessage':
            body += message.listResponseMessage?.singleSelectReply?.selectedRowId
        break
        default:
        break
    }
    return {
        "body": body,
        "isMedia": isMedia,
        "isQuotedImage": isQuotedImage,
        "isQuotedVideo": isQuotedVideo,
        "isQuotedAudio": isQuotedAudio,
        "isQuotedSticker": isQuotedSticker,
        "isMediaType": isMediaType,
        "type": type
    }
}

export default setMediaType