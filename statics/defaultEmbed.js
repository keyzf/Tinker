module.exports.setup = (client) => {

    return {
        authorImage: "./res/TinkerHappy.png",
        authorText: "Tinker",
        footerText: "See you around!",
        footerSeparator: "•",
        footerUser(preText, author, postText) {
            return {
                footerText: `${preText} ${author.tag} ${postText || ""}`,
                footerUrl: author.displayAvatarURL()
            }
        }
    }
}