document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("myModal");
    var btn = document.getElementById("createTableBtn");
    var span = document.getElementsByClassName("close")[0];

    const searchInput = document.getElementById("searchInput");
    const tableContainer = document.getElementById("tableContainer");
    const tables = tableContainer.getElementsByClassName("table-card");

    const plus = document.querySelector(".plus"),
        minus = document.querySelector(".minus"),
        num = document.querySelector(".num");
    let a = 1;  
    loadTables();

    plus.addEventListener("click", () => {
        a++;
        num.innerText = a.toString().padStart(2, '0');
    });

    minus.addEventListener("click", () => {
        if (a > 1) {
            a--;
            num.innerText = a.toString().padStart(2, '0');
        }
    });

    btn.onclick = function () {
        modal.style.display = "block";
    }

    span.onclick = function () {
        modal.style.display = "none";
        num.innerText = "01";
        a = 1;
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            num.innerText = "01";
            a = 1;
        }
    }

     searchInput.addEventListener("input", function () {
        filterTables(searchInput.value.toLowerCase());
    });

    function filterTables(searchText) {
        Array.from(tables).forEach(function (table) {
            const tableName = table.getElementsByClassName("table-name")[0].textContent.toLowerCase();
            if (tableName.includes(searchText)) {
                table.style.display = "block";
            } else {
                table.style.display = "none";
            }
        });
    }

    document.getElementById("tableForm").addEventListener("submit", function (event) {
        event.preventDefault();
        var tableName = document.getElementById("tableName").value;
        var tableType = document.querySelector('input[name="tableDesign"]:checked').value;
        var tableDesignImage = document.querySelector('input[name="tableDesign"]:checked').nextElementSibling.src;
        console.log("tableDesignImage", tableDesignImage);
        var filePath = tableDesignImage;
        var parts = filePath.split('/');
        var fileNameWithExtension = parts[parts.length - 1];
        var fileName = fileNameWithExtension.split('.')[0];

        var tableData = {
            tableName: tableName,
            tableType: tableType,
            seats: num.innerText,
            tableDesignImage: tableDesignImage,
            type: fileName === "4seatTableImg" ? "circle" : "rectangle",
        };
        console.log("tableData", tableData);
        saveTable(tableData);
        createTableCard(tableData);
        document.getElementById("tableForm").reset();
        modal.style.display = "none";
        num.innerText = "01";
        a = 1;
    });

    function createTableCard(tableData) {
        var tableCard = document.createElement("div");
        tableCard.classList.add("table-card");

        var tableContent = document.createElement("div");
        tableContent.classList.add("table-content");

        var tableName = document.createElement("h3");
        tableName.textContent = tableData.tableName;

        var designImage = document.createElement("img");
        designImage.src = tableData.tableDesignImage;
        designImage.alt = "Table Design";
        designImage.classList.add("design-image");

        var seatsContainer = document.createElement("p");
        seatsContainer.textContent = "Seats: " + tableData.seats;

        var buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

       
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.classList.add("button", "delete-button");
        deleteButton.name = "deleteButtonId";
        deleteButton.onclick = function (event) {
            event.preventDefault();
            deleteTable(tableData);
        };
        buttonContainer.appendChild(deleteButton);

         var editButton = document.createElement("button");
         editButton.innerHTML = '<i class="fas fa-pen"></i>';
         editButton.classList.add("button", "edit-button");
         editButton.onclick = function (event) {
             event,preventDefault();
             editTable(tableData);
         };
         buttonContainer.appendChild(editButton);
 

        tableContent.appendChild(tableName);
        tableContent.appendChild(designImage);
        tableContent.appendChild(seatsContainer);
        tableContent.appendChild(buttonContainer);

        tableCard.onclick = function (event) {
            if (event?.target?.type !== "submit")
                window.location.href = `table.html?type=${encodeURIComponent(tableData.tableType)}&seats=${encodeURIComponent(tableData.seats)}&tableType=${encodeURIComponent(tableData?.type)}&name=${encodeURIComponent(tableData.tableName)}`;
        };

        tableCard.appendChild(tableContent);

        document.getElementById("tableContainer").appendChild(tableCard);
    }

    function saveTable(tableData) {
        var tables = JSON.parse(localStorage.getItem('tables')) || [];
        tables.push(tableData);
        localStorage.setItem('tables', JSON.stringify(tables));
    }

    function loadTables() {
        var tables = JSON.parse(localStorage.getItem('tables')) || [];
        tables.forEach(function (tableData) {
            createTableCard(tableData);
        });
    }

    function editTable(tableData) {
        console.log("Editing table:", tableData);
    }

    function deleteTable(tableData) {
        var tables = JSON.parse(localStorage.getItem('tables')) || [];
        tables = tables.filter(function (table) {
            return table.tableName !== tableData.tableName || table.tableType !== tableData.tableType || table.seats !== tableData.seats;
        });
        localStorage.setItem('tables', JSON.stringify(tables));

        var tableCards = document.getElementsByClassName("table-card");
        for (var i = 0; i < tableCards.length; i++) {
            var card = tableCards[i];
            var cardName = card.querySelector("h3").textContent;
            if (cardName === tableData.tableName) {
                card.remove();
                break;
            }
        }
    }
});
