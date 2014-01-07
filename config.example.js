var config = {

  "trello": {

    /**
     * To get your Trello Developer API Key go to https://trello.com/1/appKey/generate.
     * You will need it to get you a token.
     * @param {string}
     */

    "key": "",

    /**
     * To get a Trello token go to
     * https://trello.com/1/<YOUR_API_KEY>&name=Open+Idea&expiration=never&response_type=token
     * You need it, to make a request to a private Board
     * @param {string}
     */

    "token": "",

    /**
     * To get a the cards out of the right list, you need to put here the id of the list.
     * @param {string}
     */

    "listId": ""

  }

};

module.exports = config;