const inputBox = document.querySelector("#user-input");
const enterButton = document.querySelector("#submit-button");
const messageDisplay = document.querySelector("#message-display");

enterButton.addEventListener('click', manageInput);

function manageInput() {
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