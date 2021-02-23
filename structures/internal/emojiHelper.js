module.exports.setup = (client) => {

    const getUnicodeEmoji = (emString) => {
        let capture = emString.match(/\p{Emoji_Presentation}/u);
        if(capture && capture.length) { return capture[0] }
        else { return undefined }
    }

    return {
        reactWith(emojiString) {
            let emoji = getUnicodeEmoji(emojiString);
            if (emoji) { return emoji; }

            if (!isNaN(emojiString)) { return emojiString }

            let match = emojiString.match(/<a?:.+?:(\d+)>/);
            if (match && match[1]) { return match[1]; }

            return undefined;
        },

        sendWith(emojiString) {
            let emoji = getUnicodeEmoji(emojiString);
            if (emoji) { return emoji; }

            if (!isNaN(emojiString)) { return client.emojis.get(emojiString); }

            let match = emojiString.match(/<a?:.+?:(\d+)>/);
            if (match && match[0]) { return match[0]; }

            return undefined;
        }
    }

}