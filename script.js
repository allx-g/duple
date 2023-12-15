const inputBox = document.querySelector("#user-input");
const enterButton = document.querySelector("#submit-button");
const messageDisplay = document.querySelector("#message-display");

enterButton.addEventListener('click', handleInput);

function handleInput() {
    const input = inputBox.value.toLowerCase();
    clearInputField();
    
    message = (isValidWord(input)) ? sendMessage("Nice word!") : sendMessage("Try again");

    console.log(message);
    
    function isValidWord(input) {
        let res = true

        Array.from(input).forEach(char => {
            console.log(char.charCodeAt(0))
            const A_ASCII_CODE = 97;
            const Z_ASCII_CODE = 122;
            if (!(char.charCodeAt(0) >= A_ASCII_CODE && char.charCodeAt(0) <= Z_ASCII_CODE)) {
                res = false;
            }
        }); 
        return res;
    }
    
    function clearInputField() {
        inputBox.value = "";
    }

    function sendMessage(message) {
        messageDisplay.textContent = message;
    }
}


// Trie data structure implementation
function TrieNode(key) {
    this.key = key;
    this.parent = null;
    this.children = {}
    this.end = false;
    this.getWord = function() {
        let output = [];
        let node = this;

        while (node !== null) {
            output.unshift(node.key);
            node = node.parent;
        }

        return output.join('');
    }
}

function Trie() {
    this.root = new TrieNode(null);

    this.insert = function(word) {
        let node = this.root;

        for (let i = 0; i < word.length; i++) {

            if (!node.children[word[i]]) {
                node.children[word[i]] = new TrieNode(word[i]);
                node.children[word[i]].parent = node;
            }

            node = node.children[word[i]];

            if (i == word.length - 1) {
                node.end = true;
            }
        }
    }

    this.contains = function(word) {
        let node = this.root;

        for (let i = 0; i < word.length; i++) {
            if (node.children[word[i]]) {
                node = node.children[word[i]];
            }
            else {
                return false;
            }
        }

        return node.end;
    }
}

