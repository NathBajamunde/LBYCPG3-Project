/***********************************************
Change Page Content
***********************************************/
// Global Variable to Denote Target Element for Content Change
const target = document.querySelector(".main-content");

// Function to Change Content to Specified Page
async function changeContent(page) {
    // Promise based system to be able to call listener attachment functions
    return new Promise((resolve, reject) => {
        try {
            fetch(`./assets/pages/${page}.html`)
                .then(res => {
                    // Get Text from Fetched Page if Response is OK
                    if (res.ok) {
                        return res.text();
                    }
                    else {
                        reject("Error: Page Not Found")
                    }
                })
                .then(content => {
                    // Swap Main Content with the New Page and fulfill promise
                    if (target) {
                        target.innerHTML = content;
                        resolve();
                    }
                    else {
                        reject("Error: Container to Place Page Not Found");
                    }
            });
        }
        catch (error) {
            reject(error);
        }
    });
}

var navBarItem;
var dropDownParent;

// Function to Set Active Page in Navbar
function setActive(id) {
    // Remove Active Class from Previously Active Item

    // Check if navBarItem is Defined and remove active class if true
    if (navBarItem) { 
        navBarItem.classList.remove("active");
    }

    // Check if dropDownParent is Defined and remove active class if true
    if (dropDownParent) { 
        dropDownParent.classList.remove("active");
    }
    
    // Set New Active Item
    navBarItem = document.getElementById(id);
    navBarItem.classList.add("active");

    // Set Dropdown Item Active if Applicable
    if (navBarItem.classList.contains("item-learn")) {
        dropDownParent = document.getElementById("learnDropdown");
        dropDownParent.classList.add("active");
    }
    else if (navBarItem.classList.contains("item-interact")) {
        dropDownParent = document.getElementById("interactDropdown");
        dropDownParent.classList.add("active");
    }
}

// Function to make calling page change functions simpler
async function pageChange(page) {
    // General Calls
    await changeContent(page);
    setActive(page);
    clearList();
    addToList([0]);
    rstCalc();

    // Page Specific Calls
    if (page == "logicStudio") {
        addCalcListener();
    }
}

/***********************************************
Search Functionality
***********************************************/
// Search Results Look Up Table
const searchList = [
    ["disabled", "searchNoResults",     "", "No Results Found"],
    ["", "searchLogicGates",    "pageChange('logicGates'); return false;", "Logic Gates"],
    ["", "searchCombiVsSeq",    "pageChange('combiVsSeq'); return false;", "Combinational vs Sequential Logic"],
    ["", "searchNot",           "pageChange('not'); return false;", "NOT Gate"],
    ["", "searchAnd",           "pageChange('and'); return false;", "AND Gate"],
    ["", "searchOr",            "pageChange('or'); return false;", "OR Gate"],
    ["", "searchNand",          "pageChange('nand'); return false;", "NAND Gate"],
    ["", "searchNor",           "pageChange('nor'); return false;", "NOR Gate"],
    ["", "searchXor",           "pageChange('xor'); return false;", "XOR Gate"],
    ["", "searchXnor",          "pageChange('xnor'); return false;", "XNOR Gate"],
    ["", "searchAdders",        "pageChange('adders'); return false;", "Adders"],
    ["", "searchMultiplexers",  "pageChange('multiplexers'); return false;", "Multiplexers"],
    ["", "searchDecoders",      "pageChange('decoders'); return false;", "Decoders"],
    ["", "searchFlipFlops",     "pageChange('flipFlops'); return false;", "Flip-Flops"],
    ["", "searchCounters",      "pageChange('counters'); return false;", "Counters"],
    ["", "searchLogicStudio",   "pageChange('logicStudio'); return false;", "Logic Studio"],
    ["", "searchQuiz",          "pageChange('quiz'); return false;", "Quiz"],
    ["", "searchHome",          "pageChange('home'); return false;", "Home"]
];

// Remove Currently Exisiting Items from List
function clearList() {
    document.getElementById("searchDropdownList").innerHTML = "";
}

// Function to filter out searchList based on the input search term
function searchItems(searchTerm) {
    // Normalize Search Term (Convert to Lowercase, Remove Spaces, Remove Dashes)
    searchTerm = searchTerm.toLowerCase().replace(/\s+/g, "").replace(/-/g, "");

    // Return No Results Found if Empty searchTerm
    if (searchTerm == "") return [searchList[0]];

    // Filter searchList that includes the search term
    return results = searchList.filter(
        row => row[3].toLowerCase().replace(/\s+/g, "").replace(/-/g, "").includes(searchTerm)
    );
};

// Add newly searched items to the list
function addToList(filteredSearch) {
    // Declare an Empty String
    var htmlListString = "";

    // No User
    if (filteredSearch.length == 0) {
        htmlListString = `<li><a class="dropdown-item item-search ${searchList[0][0]}" href="#" id="${searchList[0][1]}" onclick="${searchList[0][2]}">${searchList[0][3]}</a></li>`
    }

    // Create Search Dropdown using the Filtered Search Results
    else {
        // Create HTML code for adding list
        filteredSearch.forEach(item => {
            var newItem = `<li><a class="dropdown-item item-search ${item[0]}" href="#" id="${item[1]}" onclick="${item[2]}">${item[3]}</a></li>` 
            htmlListString = htmlListString.concat(newItem)
        });
    }

    // Insert HTML code into the document and add the list
     document.getElementById("searchDropdownList").innerHTML = htmlListString;
}

// Summary Function for updating search list
function updateList() {
    // Clear Current List
    clearList();
    // Get Keywords based on the typed text
    const filteredSearch = searchItems(document.getElementById("searchInput").value);
    // Create new list
    addToList(filteredSearch);
}

// Go to first Page on the search list
function search() {
    searchList.forEach((value, index) => {
        if (index > 0) {
            const element = document.getElementById(value[1]);
            if (element) {
                // Hide Dropdown if Page Change
                dropDown.hide();
                // Reset Search Bar After Searching
                document.getElementById("searchInput").value = "";
                // Focus out of the search bar with successful search
                srchListen.blur();
                // Change the page
                element.click();
                return;
            }
        }
    });
}

// Listener Variable
var srchListen = document.getElementById("searchInput");

// Get element to drop down 
const dropDown = new bootstrap.Dropdown(document.getElementById("searchDropdownList"));

// Event Listeners
srchListen.addEventListener("input", function(event) {
    // Update the current List
    updateList();
    // Show the dropdown menu
    dropDown.show();
});

srchListen.addEventListener("keydown", function(event) {
    // If Enter on Keyboard is Pressed
    if (event.key === "Enter") {
        // Prevent Default Event Action
        event.preventDefault();
        // Call Search Function
        search();
    }
});

srchListen.addEventListener("focusout", function(event) {
    dropDown.hide();
});

/***********************************************
Logic Calculator Input Functions
***********************************************/

var maxCalcIdx = 0;
var calcIdx = 0;

// Reset Calculator When Moving to Another Page
function rstCalc() {
    maxCalcIdx = 0;
    calcIdx = 0;
    varsCurrent = new Set();
}

// Delete the character before the caret in the calculator
function delCalc() {
    const calcInput = document.getElementById("calculatorInput");

    // Delete only if the caret is not befor the first character
    if (calcIdx > 0) {
        // Get current expression in the input box at where caret is
        var calcExpression = calcInput.value;

        // Delete the character before the caret
        calcInput.value = calcExpression.slice(0, calcIdx-1) + calcExpression.slice(calcIdx);

        // Decrement indicators
        calcIdx--;
        maxCalcIdx--;
    }

    // Set focus to expression input (Make caret appear)
    calcInput.focus();
    calcInput.setSelectionRange(calcIdx, calcIdx);

    // Manually Trigger Input Event
    calcInput.dispatchEvent(new Event('input'));
}

// Remove all text from the calculator
function clrCalc() {
    const calcInput = document.getElementById("calculatorInput");

    // Clear Text
    calcInput.value = "";

    // Reset Caret Index Tracker
    calcIdx = 0;
    maxCalcIdx = 0;

    // Focus on the Expression Input
    calcInput.focus();

    // Make Caret Visible
    calcInput.setSelectionRange(0,0);

    // Manually Trigger Input Event
    calcInput.dispatchEvent(new Event('input'));
}

// Add new character to the expression at the caret location
function inputCalc(char) {
    const calcInput = document.getElementById("calculatorInput");

    // Get current expression in the input box at where caret is
    var calcExpression = calcInput.value;

    // Insert the new character in the caret position
    calcInput.value = calcExpression.slice(0, calcIdx) + char + calcExpression.slice(calcIdx);

    // Increment position indicators
    calcIdx++;
    maxCalcIdx++;

    // Set focus to expression input (Make caret appear)
    calcInput.focus();
    calcInput.setSelectionRange(calcIdx, calcIdx);

    // Manually Trigger Input Event
    calcInput.dispatchEvent(new Event('input'));
}

// Move the caret to the left
function leftCalc() {
    const calcInput = document.getElementById("calculatorInput");

    // Focus on Expression Input (Make Caret Visible)
    calcInput.focus();

    // Remain at First Index if Cursor Already There
    if (calcIdx == 0) {
        calcInput.setSelectionRange(0, 0);
    }

    // Move The Caret Left
    else {
        calcIdx--;
        calcInput.setSelectionRange(calcIdx, calcIdx);
    }
}

// Move the caret to the right
function rightCalc() {
    const calcInput = document.getElementById("calculatorInput");

    // Focus on Expression Input (Make Caret Visible)
    calcInput.focus();

    // Remain at Max Index if Cursor Already There
    if (calcIdx == maxCalcIdx) {
        calcInput.setSelectionRange(maxCalcIdx, maxCalcIdx);
    }

    // Move The Caret Right
    else {
        calcIdx++;
        calcInput.setSelectionRange(calcIdx, calcIdx);
    }
}

// Misc Accepted Keyboard Keys (Modify as needed)
const calcAcc = [
    "(", ")", "[", "]", "{", "}", "&", "+", "!", "^"
];

// Listener for keyboard based expression input
function addCalcListener() {
    const calcInput = document.getElementById("calculatorInput");

    // Add Listeners based on keyboard press
    calcInput.addEventListener('keydown', (event) => {

        // Accept Uppercase Letters and Adjust Button-Based Input Indices
        if (/^[A-Z]$/.test(event.key)) {
            calcIdx++;
            maxCalcIdx++;
        }

        // Convert Lowercase to Upper-Case Letters to Add
        else if (/^[a-z]$/.test(event.key)) {
            event.preventDefault();
            inputCalc(event.key.toUpperCase());
            // Manually Trigger Input Event
            calcInput.dispatchEvent(new Event('input'));
        }

        // Accept 0 and 1 Inputs 
        else if (/^[0-1]$/.test(event.key)) {
            calcIdx++;
            maxCalcIdx++;
        }

        // Accepted Misc Keys
        else if (calcAcc.includes(event.key)) {
            calcIdx++;
            maxCalcIdx++;
        }

        // Keyboard Clear All Typed text 
        else if ((event.ctrlKey || event.metaKey) && event.key == "Backspace") {
            maxCalcIdx -= calcIdx;
            calcIdx = 0;
        }

        // Accept Backspace and adjust Button-Based Input Indices
        else if (event.key == "Backspace") {
            calcIdx--;
            maxCalcIdx--;
        }

        // Accept Delete but treat it as Backspace
        else if (event.key == "Delete") {
            event.preventDefault();
            delCalc();
            // Manually Trigger Input Event
            calcInput.dispatchEvent(new Event('input'));
        }

        // Move caret left on key press
        else if (event.key == "ArrowLeft") {
            event.preventDefault();
            leftCalc();
        }

        // Move caret right on key press
        else if (event.key == "ArrowRight") {
            event.preventDefault();
            rightCalc();
        }

        // Reject All Other Keys
        else {
            event.preventDefault();
        }
    });

    // Input-based Listener for obtaining latest expression
    calcInputListers(calcInput);

    calcInput.addEventListener('click', event => {
        calcIdx = event.target.selectionStart
        console.log(calcIdx);
    });
}

function calcInputListers(element) {
    element.addEventListener('input', event => {
        // Extract Variables from the Input Expression
        const variables = getExpVars();
        
        // Update The Variables Input Table
        const status = updateVarInTable(variables);
        
        // Update The Truth Table
        updateTruthTable(status, variables);
    }); 
}

/***********************************************
Logic Calculator Operation Functions
***********************************************/

// Get Variables from Expression
function getExpVars() {
    // Get Expression
    var calcExpression = document.getElementById("calculatorInput").value;
    
    // Use Set to store variables found to avoid duplicates
    var variables = new Set();

    // Extract Remove All Non-Alpha In Input
    calcExpression = calcExpression.replace(/[^A-Z]/gi, '')

    // Extract Unique Variables from Expression
    Array.from(calcExpression).forEach(letter => {
        variables.add(letter);
    });
    
    return variables;
}

var varsCurrent = new Set();

// Update the Variable Input Table
function updateVarInTable(variables) {
    // Update Variable Table with New Variables
    if (variables.size > 0) {
        // Remove No Variable Message if it exists
        var noVarMsg = document.getElementById("vars-None");
        if (noVarMsg) noVarMsg.remove();

        // Remove All Variables in the Table Currently Not In The Expression
        varsCurrent.forEach(vari => {
            if (!variables.has(vari)) {
                document.getElementById(`vars-${vari}`).remove();
                varsCurrent.delete(vari);
            }
        });

        // Add New Variables
        variables.forEach(vari => {
            if (!varsCurrent.has(vari)) {
                varsCurrent.add(vari);
                var newVar = `
                    <tr id="vars-${vari}">
                        <td class="var-name">${vari}</td>
                        <td>
                            <select class="form-select" id="${vari}-value" aria-label="${vari}-value">
                                <option value="0">0</option>
                                <option value="1">1</option>
                            </select> 
                        </td>
                    </tr>`;
                document.getElementById("calcVarContainer").insertAdjacentHTML('beforeend',  newVar);
                calcInputListers(document.getElementById(`${vari}-value`));
            }
        });

        // Get Expression Input
        const calcExpression = document.getElementById("calculatorInput").value;

        // Get Valus for Each Variable
        const varVal = getVarVal();

        // Calculate the Output of the Calculator
        const output = calculateLogic(calcExpression, varVal);

        // Get Output Container
        var outContainer = document.getElementById("vars-Output");
        
        // Create Output Container if it does not exist
        if (outContainer == null) {
            document.getElementById("outputContainer").innerHTML = `
                <tr id="vars-Output">
                    <th>Output</th>
                    <th id="outVal"></th>
                </tr>`;
        }

        // Invalid Expression Message if Invalid Output
        if (output == -1) {
            document.getElementById("outVal").innerHTML = `Invalid Expression!`;
            return false;
        }
        
        // Output if Valid Expression
        else {
            document.getElementById("outVal").innerHTML = `${output ? 1 : 0}`;
            return true;
        }
    }

    // Add No Variable Message
    else {
        // Clear the current variables
        varsCurrent = new Set();

        // Delete Output Container if not yet deleted
        const toDel = document.getElementById("vars-Output");
        if (toDel) toDel.remove();
        

        // Overwrite variables in table with No Variables Message
        document.getElementById("calcVarContainer").innerHTML = `
            <tr id="vars-None">
                <td colspan="2">Add Variables in the Logic Calculator First!</td>
            </tr>`;
        return false;
    }
}

// Get the Assigned Logic Level / Value for each for variable
function getVarVal() {
    // Use a Map to Store Variables as Key-Value Pairs
    var varVal = new Map();
    varsCurrent.forEach(vari => {
        // Add to the map the variable and its obtained value
        varVal.set(vari, parseInt(document.getElementById(`${vari}-value`).value));
    });
    return varVal;
}

// Translate Expression to be compatible with math.js evaluate()
function translateExp(expr) {
    // Convert & to and, + to or, ! to not, ^ to xor
    return expr.replace(/&/g, " and ").replace(/\+/g, " or ").replace(/!/g, "not ").replace(/\^/g, " xor ");
}

// Evaluate the Given Expression as to Whether it is Valid or Not
function calculateLogic(calcExpression, valMap) {
    // Translate Expression Input to math.evaluate() compatible
    calcExpression = translateExp(calcExpression);

    // Replace Variables with their corresponding value
    varsCurrent.forEach(vari => {
        const regex = new RegExp(vari, 'g');
        calcExpression = calcExpression.replace(regex, valMap.get(vari));
    });

    // Check if the expression has variables and constants directly after each other
    if (/00/.test(calcExpression) || /01/.test(calcExpression) || 
        /10/.test(calcExpression) || /11/.test(calcExpression)) {
        // Flag as Invalid Expression in this case
        return -1;
    }

    // Evaluate the Expression
    try {
        return math.evaluate(calcExpression);
    }
    // Return -1 to Flag as Invalid Expression
    catch (error) {
       return -1; 
    }
}

/***********************************************
Truth Table Generation Functions
***********************************************/

// Primary Function for Updating the Truth Table
function updateTruthTable(status, variables) {
    // Hide the Truth Table if No or Invalid Expression
    if (!status) {
        document.getElementById("ttSection").classList.add("hidden");
    }

    // Make Truth Table Visible if Valid Expression and Update It
    else {
        document.getElementById("ttSection").classList.remove("hidden");
        setupTT();
        assignVarVals();
    }
}

// Setup up columns and headers of the truth table
function setupTT() {
    // Get Number of Variables in the system
    const n = varsCurrent.size;

    // Adjust length of table name header to number of variables + the output
    document.getElementById("ttHeader").innerHTML = `<th colspan="${n + 1}">Truth Table</th>`;
 
    // Empty the table of variables
    document.getElementById("ttBodyVars").innerHTML = "";
    
    // Get Variable Header Container
    const varHeader = document.getElementById("ttVarHeader");

    // Empty Variable Header
    document.getElementById("ttVarHeader").innerHTML = "";
    
    // Add Each Variable as a Header
    varsCurrent.forEach(vari =>{
        varHeader.innerHTML += `<th>${vari}</th>`;
    }); 

    varHeader.innerHTML += `<th>Output</th>`
}

// Generate All Variable Value Combinations for the Truth Table
function assignVarVals() {
    const n = varsCurrent.size;

    // Loop through the number of combinations
    for (var i = 0; i < 2 ** n; i++) {
        // Store variables and values as key-value pairs
        var varVal = new Map();
        var j = 0;
        varsCurrent.forEach(vari => {
            // Shift by J Positions to the right to extract bit
            varVal.set(vari, ((i >> j) & 1));
            j++;
        });
        addToTT(varVal, i);
    }
}

// Add a new row to the truth table
function addToTT(varVal, index) {
    // Create new variable value row
    document.getElementById("ttBodyVars").innerHTML += `<tr id="var-row-${index}"></tr>`

    // Get newly created row element
    const varRow = document.getElementById(`var-row-${index}`);

    // Add variable values to the row
    varsCurrent.forEach(vari => {
        varRow.innerHTML += `<td>${varVal.get(vari)}</td>`;
    });

    // Calculate the output
    const output = calculateLogic(document.getElementById("calculatorInput").value, varVal); 
    // Add the output
    varRow.innerHTML += `<td>${output ? 1 : 0}</td>`
}

/***********************************************
Miscellaneous / Testing Functions
***********************************************/
// Testing Function
function test() {
    console.log("Success");
}

/***********************************************
Startup Functions (Functions to Call on Load)
***********************************************/
pageChange("home");

