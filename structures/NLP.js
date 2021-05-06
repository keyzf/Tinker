'use strict';

const { dockStart } = require("@nlpjs/basic");
const posTagger = require( 'wink-pos-tagger' );

class NLP {
    constructor(corpusFile) {
        this.corpusFile = corpusFile;
        this.trained = false;
        this.tagger = posTagger();
    }

    async train() {
        this.dock = await dockStart({ use: ["Basic"] });
        this.nlp = this.dock.get("nlp");
        await this.nlp.addCorpus(this.corpusFile);
        await this.nlp.train();
        this.trained = true;
    }

    async rebuildWithLemma(message) {
        const tokens = this.tagger.tagSentence(message);
        return tokens.reduce((acc, curr) => {
            if(curr.lemma){
                return acc + (curr.tag != "word" ? "" : " ") + curr.lemma
            }
            return acc + (curr.tag != "word" ? "" : " ") + curr.value
        }, "");
    }

    async getResponse(message) {       
        if (!this.trained) { return {answer:"One sec, im still booting up"}; }
        return await this.nlp.process('en', message);
    }
}

module.exports = NLP;