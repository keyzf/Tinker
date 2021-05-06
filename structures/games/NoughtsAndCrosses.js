'use strict'

class NoughtsAndCrosses {
    constructor(client, message, gameMessage, player1) {
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ];
        this.choices = {
            a: { 1: { row: 0, col: 0 }, 2: { row: 0, col: 1 }, 3: { row: 0, col: 2 } },
            b: { 1: { row: 1, col: 0 }, 2: { row: 1, col: 1 }, 3: { row: 1, col: 2 } },
            c: { 1: { row: 2, col: 0 }, 2: { row: 2, col: 1 }, 3: { row: 2, col: 2 } },
        }
        this.posToIndex = {
            0: [0, 0],
            1: [0, 1],
            2: [0, 2],
            3: [1, 0],
            4: [1, 1],
            5: [1, 2],
            6: [2, 0],
            7: [2, 1],
            8: [2, 2]
        }
        this.winningLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        this.client = client;
        this.message = message;
        this.gameMessage = gameMessage;
        this.player1 = player1; // always O
        this.player2; // always X

        return this.runGame();
    }

    renderBoard() {
        let visualBoard = ``;
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                visualBoard += this.client.emojiHelper.sendWith(this.client.data.emojis.noughtsAndCrosses[this.board[row][col]]) + " ";
            }
            visualBoard += `\n`
        }
        return visualBoard;
    }


    takeTurn(player, symbol) {
        return new Promise(async(resolve, reject) => {
            this.gameMessage.edit(this.client.operations.generateEmbed.run({
                title: "Noughts and Crosses",
                description: `Player ${player.username}'s turn ${this.client.data.emojis.noughtsAndCrosses[symbol]}`,
                fields: [
                    { name: "Board", value: this.renderBoard() }
                ]
            }));

            async function getUserInput(gameObj) {
                let collected;
                try {
                    collected = await gameObj.gameMessage.channel.awaitMessages(m => m.author.id == player.id && m.content.indexOf(".") != 0, { max: 1, time: 30000 })
                } catch {
                    gameObj.gameMessage.edit(gameObj.client.operations.generateEmbed.run({
                        title: "Noughts and Crosses",
                        description: `${player.username} ${gameObj.client.data.emojis.noughtsAndCrosses[symbol]} took too long to take their turn`,
                        fields: [
                            { name: "Board", value: gameObj.renderBoard() }
                        ]
                    }));
                    return resolve(false);
                }

                if (!collected.first()) { return null; }
                const responseChars = collected.first().content.toLowerCase().trim().split("");
                gameObj.client.operations.deleteCatch.run(collected.first());
                if(responseChars.join("") == "resend") {
                    const m = await gameObj.gameMessage.channel.send(gameObj.client.operations.generateEmbed.run({
                        title: "Noughts and Crosses",
                        description: `Player ${player.username}'s turn ${gameObj.client.data.emojis.noughtsAndCrosses[symbol]}`,
                        fields: [
                            { name: "Board", value: gameObj.renderBoard() }
                        ]
                    }));
                    await gameObj.client.operations.deleteCatch.run(gameObj.gameMessage);
                    gameObj.gameMessage = m;
                    return null
                }
                if (!responseChars.length == 2 || !gameObj.choices[responseChars[0]] || !gameObj.choices[responseChars[0]][responseChars[1]]) {
                    gameObj.gameMessage.edit(gameObj.client.operations.generateEmbed.run({
                        title: "Noughts and Crosses",
                        description: `${player.username} ${gameObj.client.data.emojis.noughtsAndCrosses[symbol]} this is not a valid choice, please use abc (top->bottom) and 123 (L->R)`,
                        fields: [
                            { name: "Board", value: gameObj.renderBoard() }
                        ]
                    }));
                    return null
                }
                return responseChars
            }

            async function placeUserInput(gameObj, responseChars) {
                const pos = gameObj.choices[responseChars[0]][responseChars[1]]
                if (gameObj.board[pos.row][pos.col] == null) {
                    gameObj.board[pos.row][pos.col] = symbol;
                    return gameObj.board;
                }
                gameObj.gameMessage.edit(gameObj.client.operations.generateEmbed.run({
                    title: "Noughts and Crosses",
                    description: `${player.username} ${gameObj.client.data.emojis.noughtsAndCrosses[symbol]} this is not a valid choice, you cannot place on top of another counter`,
                    fields: [
                        { name: "Board", value: gameObj.renderBoard() }
                    ]
                }));
                return null
            }


            for (let i = 0; i < 3; i++) {
                const userInput = await getUserInput(this);
                if (!userInput) continue;
                const placed = await placeUserInput(this, userInput);
                if (!placed) { continue } else { this.board = placed; }
                return resolve(true);
            }

            this.gameMessage.edit(this.client.operations.generateEmbed.run({
                title: "Noughts and Crosses",
                description: `${player.username} ${this.client.data.emojis.noughtsAndCrosses[symbol]} You clearly can't play the game right, you forfeit this round`,
                fields: [
                    { name: "Board", value: this.renderBoard() }
                ]
            }));

            return resolve(false);
        });
    }

    checkWin(player, symbol) {
        for (let i = 0; i < this.winningLines.length; i++) {
            const line = this.winningLines[i];
            if (line.every((pos) => this.board[this.posToIndex[pos][0]][this.posToIndex[pos][1]] == symbol)) {
                this.gameMessage.edit(this.client.operations.generateEmbed.run({
                    title: "Noughts and Crosses",
                    description: `${player.username} won!`,
                    fields: [
                        { name: "Board", value: this.renderBoard() }
                    ]
                }));
                return true;
            }
        }
        return false;
    }

    checkDraw() {
        if (
            this.board.every((row) => {
                return row.every((tile) => {
                    return tile != null;
                });
            })
        ) {
            this.gameMessage.edit(this.client.operations.generateEmbed.run({
                title: "Noughts and Crosses",
                description: `Game ended in a draw :(`,
                fields: [
                    { name: "Board", value: this.renderBoard() }
                ]
            }));
            return true;
        }
        return false;
    }

    async getOpponent() {
        this.gameMessage.edit(this.client.operations.generateEmbed.run({
            title: "Noughts and Crosses",
            description: `${this.client.emojiHelper.sendWith(this.client.data.emojis.custom.loading)} Waiting for a user to join`,
            colour: this.client.statics.colours.tinker,
            ...this.client.statics.defaultEmbed.footerUser("", this.player1, "is waiting")
        }));
        this.gameMessage.react(this.client.emojiHelper.reactWith(this.client.data.emojis.custom.TinkerExclamation_blue));

        try {
            const filter = (reaction, user) => reaction.emoji.id == this.client.emojiHelper.reactWith(this.client.data.emojis.custom.TinkerExclamation_blue) && user.id != this.message.author.id && user.id != this.client.user.id;
            const collection = await this.gameMessage.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
            let reaction = collection.first();
            this.player2 = reaction.users.cache.last();
            await this.gameMessage.reactions.removeAll()
            return true;
        } catch (err) {
            this.gameMessage.reactions.removeAll().then(async() => {
                this.gameMessage.edit(this.client.operations.generateEmbed.run({
                    title: "Nobody joined your game",
                    colour: this.client.statics.colours.tinker
                }));
                this.client.operations.deleteCatch.run(this.gameMessage, 5000);
                this.client.operations.deleteCatch.run(this.message, 5000);
            });
            return false;
        }
    }

    async runGame() {
        const cont = await this.getOpponent();
        if (!cont) {
            return;
        }

        this.gameMessage.edit(this.client.operations.generateEmbed.run({
            title: "Noughts and Crosses",
            description: `${this.player1.username} vs ${this.player2.username}`,
            fields: [
                { name: "How to Play", value: `It's noughts and crosses... children play this
                Use a coordinate system to place your counters, abc from top to bottom and 123 from left to right
                put "." at the start of your message for the bot to ignore it` }
            ],
            footerText: "Game begins in 8 seconds"
        }));
        await this.client.utility.countdown(1000, 8, (num) => {
            if (num <= 3) {
                this.gameMessage.react(this.client.data.emojis.characterSet[num]);
            }
        });
        await this.gameMessage.reactions.removeAll();

        for (let turn = 0; turn < 5; turn++) {
            if (!await this.takeTurn(this.player1, "O")) { return; }
            if (this.checkWin(this.player1, "O")) { return { winner: this.player1, loser: this.player2 }; }
            if (this.checkDraw()) { return; }
            if (!await this.takeTurn(this.player2, "X")) { return; }
            if (this.checkWin(this.player2, "X")) { return { winner: this.player2, lower: this.player1 }; }
            if (this.checkDraw()) { return; }
        }

        this.gameMessage.edit(this.client.operations.generateEmbed.run({
            title: "Noughts and Crosses",
            description: `Well something failed, probably my win checking!`,
            fields: [
                { name: "Board", value: this.renderBoard() }
            ],
            colour: client.statics.colours.tinker
        }));
    }
}
module.exports = NoughtsAndCrosses;