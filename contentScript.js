window.addEventListener("load", myMain, false);

/**
 * Source: https://stackoverflow.com/a/13917682
 */
function myMain(event) {
    console.log("my main")
    var timer = setInterval(waitForHTMLToLoad, 1000);

    function waitForHTMLToLoad() {
        console.log("wait for")

        if (document.querySelector("#transfer-list > div > table")) {
            clearInterval(timer);

            /**
             * Step 0: Prepare the new column
             */
            let trHeadHTMLElement = document.querySelectorAll("tr.thead");
            trHeadHTMLElement.forEach(function (HTMLElement) {
                let node = document.createElement("th");
                let textnode = document.createTextNode("Profit");
                node.appendChild(textnode);
                node.classList.add("text-right");
                HTMLElement.appendChild(node);
            });

            let trPlayerTableRowHTMLElement = document.querySelectorAll("tr.player-table-row");
            trPlayerTableRowHTMLElement.forEach(function (HTMLElement) {
                let node = document.createElement("td");
                let textnode = document.createTextNode("5.12M");
                node.appendChild(textnode);
                node.classList.add("td-price");
                HTMLElement.appendChild(node);
            });

            /**
             * Step 1: 
             * Get all players names & prices
             */
            let tableHTMLElement = document.querySelector("#transfer-list > div > table");
            let allPlayersHTMLElement = document.querySelectorAll("tr.player-table-row td:first-child [data-bind='text: name']");
            let allPricesHTMLElement = document.querySelectorAll("tr.player-table-row td.td-price [data-bind='currency: price, roundCurrency: 1, fractionDigits: 1']");
            let players = getPlayersAndPrices(allPlayersHTMLElement, allPricesHTMLElement);

            /**
             * Step 2:
             * Get all players values
             */
            let allPlayerValuesHTMLElement = document.querySelectorAll(".player-table-row");
            getPlayersValues(players, allPlayerValuesHTMLElement);

            clearInterval(timer);
            console.log("done refreshing");

            /**
             * Step 3: WIP, what players to buy
             */
        }
    }
}

function getPlayersAndPrices(allPlayersHTMLElement, allPricesHTMLElement) {
    let i = 0;
    let length = allPlayersHTMLElement.length;
    let array = [];
    for (; i < length;) {
        array.push({
            playerTransferListName: allPlayersHTMLElement[i].textContent,
            playerPrice: parseFloat(allPricesHTMLElement[i].textContent),
            playerValue: 0,
            playerCost: 0
        });
        i++;
    }

    return array;
}

function getPlayersValues(players, allPlayerValuesHTMLElement) {
    console.log(players)

    let i = 0;
    let length = allPlayerValuesHTMLElement.length;
    for (; i < length;) {

        //Clone the modal
        let modalHTMLElement = document.querySelector("#genericModalContainer");
        console.log(modalHTMLElement)

        //Open the modal by clicking on the row
        allPlayerValuesHTMLElement[i].click();

        //Reading name and value
        let playerCardName = document.querySelector(".player-profile-name").textContent; //10. Lionel Messi
        res = playerCardName.split(" ");
        playerCardName = res[res.length - 1]; //Messi

        let playerValue = document.querySelector(".player-profile-stat [data-bind='currency: value, fractionDigits: 1, roundCurrency: isSessionPlayer ? RoundCurrency.Downwards : RoundCurrency.Upwards']").textContent; //35.1M
        playerValue = parseFloat(playerValue); //35.1

        //Update players
        for (let item of players) {
            if (item.playerTransferListName.includes(playerCardName)) {
                item.playerCardName = playerCardName;
                item.playerValue = playerValue;
                item.playerCost = item.playerPrice - playerValue;
                break;
            }
        }

        // WIP
        players.sort(function (a, b) {
            return a.playerCost - b.playerCost;
        });
        console.log(players);

        //Reset modal
        console.log("i don't know how to close the modal");
        i++;
    }
}

