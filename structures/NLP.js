const { dockStart } = require("@nlpjs/basic");

class NLP {
    constructor(corpusFile) {
        this.corpusFile = corpusFile;
        this.trained = false;
    }

    async train() {
        this.dock = await dockStart({ use: ["Basic"] });
        this.nlp = this.dock.get("nlp");
        await this.nlp.addCorpus(this.corpusFile);
        await this.nlp.train();
        this.trained = true;
    }

    async getResponse(message) {
        if (!this.trained) { return message.channel.send("One sec, im still booting up"); }
        return await this.nlp.process('en', message);
    }
}

module.exports = NLP;