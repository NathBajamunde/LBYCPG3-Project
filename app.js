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
    addToList([]);
    rstCalc();
    document.getElementById("searchInput").value = ""; // Blank Search Bar on change

    // Page Specific Calls
    if (page == "logicStudio") {
        addCalcListener();
    }
    if (page == "quiz") {
        initQuiz(); 
    }

    window.scrollTo(0, 0); // Go To Top of Page
}

/***********************************************
Search Functionality
***********************************************/
// Search Results Look Up Table
const searchList = [
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
    if (searchTerm == "") return [];

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
        htmlListString = `<li><a class="dropdown-item item-search disabled" href="#" id="searchNoResults" onclick="">No Results Found</a></li>`;
    }

    // Create Search Dropdown using the Filtered Search Results
    else {
        // Create HTML code for adding list
        filteredSearch.forEach(item => {
            var newItem = `<li><a class="dropdown-item item-search ${item[0]}" href="#" id="${item[1]}" onclick="${item[2]}">${item[3]}</a></li>`; 
            htmlListString = htmlListString.concat(newItem);
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

// Search Function
function search() {
    // Get the search term, convert to lowercase, and remove extra spaces
    let input = document.getElementById('searchInput').value.toLowerCase().trim();

    // If the search bar is empty, do nothing
    if (input === "") return;

    //database of searchable pages (Removed .html because changeContent adds it automatically)
    const pages = [
        { name: "home", file: "home" },
        { name: "and gate", file: "and" },
        { name: "or gate", file: "or" },
        { name: "not gate", file: "not" },
        { name: "nand gate", file: "nand" },
        { name: "nor gate", file: "nor" },
        { name: "xor gate", file: "xor" },
        { name: "xnor gate", file: "xnor" },
        { name: "combinational circuits", file: "combiVsSeq" },
        { name: "sequential circuits", file: "combiVsSeq" },
        { name: "adders", file: "adders" },
        { name: "multiplexers", file: "multiplexers" },
        { name: "decoders", file: "decoders" },
        { name: "flip-flops", file: "flipFlops" },
        { name: "counters", file: "counters" },
        { name: "logic studio", file: "logicStudio" },
        { name: "quiz", file: "quiz" }
    ];

    // Strict Word Boundary Match
    let exactWordRegex = new RegExp("\\b" + input + "\\b", "i");
    let exactMatch = pages.find(p => exactWordRegex.test(p.name));

    if (exactMatch) {
        pageChange(exactMatch.file); 
        document.getElementById('searchInput').value = ""; // Clear the search bar
        return;
    }

    // Partial Match Fallback
    let partialMatch = pages.find(p => p.name.includes(input));
    
    if (partialMatch) {
        pageChange(partialMatch.file); 
        document.getElementById('searchInput').value = ""; // Clear the search bar
        return;
    }

    // If nothing matches at all
    alert("No results found for: " + input);
}

// Listener Variable
var srchListen = document.getElementById("searchInput");
var dropDownListen = document.getElementById("searchDropdownList");

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
    // 200ms delay before hiding to allow for clicking
    setTimeout(() => {
        dropDown.hide();
    }, 200);
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

/***********************************************
Quiz Functionality
***********************************************/
function initQuiz() {
    // QUESTION BANKS 
    const baseImgPath = 'assets/images/';  // Updated to match directory

    const easyBank = [
        { question: "What is the output of a 2-input AND gate when A=1, B=1?", options: ["0", "1", "undefined", "floating"], correct: 1, img: null },
        { question: "Which gate is also called an inverter?", options: ["AND", "OR", "NOT", "NAND"], correct: 2, img: null },
        { question: "Identify this gate:", options: ["AND", "OR", "XOR", "NOT"], correct: 3, img: "not1.png" },
        { question: "A 2-input OR gate gives output 1 when:", options: ["both inputs 0", "at least one input 1", "both inputs 1", "inputs are equal"], correct: 1, img: null },
        { question: "What is the Boolean expression for a 2-input AND gate?", options: ["X = A+B", "X = A·B", "X = A⊕B", "X = A'B"], correct: 1, img: null },
        { question: "Name this universal gate:", options: ["NOR", "NAND", "XOR", "AND"], correct: 1, img: "nand1.png" },
        { question: "How many inputs does a NOT gate have?", options: ["1", "2", "3", "depends"], correct: 0, img: null },
        { question: "Which gate outputs 1 only when all inputs are 1?", options: ["OR", "NAND", "AND", "NOR"], correct: 2, img: null },
        { question: "Identify the gate from symbol:", options: ["OR", "AND", "NOR", "XNOR"], correct: 0, img: "or1.png" },
        { question: "The output of a 2-input NOR gate is 1 when:", options: ["A=0,B=0", "A=0,B=1", "A=1,B=0", "A=1,B=1"], correct: 0, img: null },
        { question: "What does the bubble on a gate output represent?", options: ["inversion", "buffer", "clock", "ground"], correct: 0, img: null },
        { question: "This is the symbol for _____ gate:", options: ["XOR", "XNOR", "NOR", "NAND"], correct: 0, img: "xor1.png" },
        { question: "Which gate is known as 'exclusive OR'?", options: ["XOR", "XNOR", "OR", "NOR"], correct: 0, img: null },
        { question: "How many possible input combinations for a 3-input AND gate?", options: ["4", "6", "8", "16"], correct: 2, img: null },
        { question: "The ____ gate can be made by connecting a NOT to an AND.", options: ["NAND", "NOR", "XOR", "OR"], correct: 0, img: null }
    ];

    const moderateBank = [
        { question: "Which of these is a universal gate?", options: ["AND", "OR", "XOR", "NAND"], correct: 3, img: null },
        { question: "The sum output of a half adder is given by:", options: ["A·B", "A⊕B", "A+B", "(A·B)'"], correct: 1, img: null },
        { question: "Identify this combinational circuit:", options: ["half adder", "full adder", "2x1 MUX", "decoder"], correct: 0, img: "halfadder.png" },
        { question: "A full adder has how many inputs?", options: ["2", "3", "4", "5"], correct: 1, img: null },
        { question: "The carry output of a half adder is:", options: ["A AND B", "A OR B", "A XOR B", "A NAND B"], correct: 0, img: null },
        { question: "This is a _____ multiplexer.", options: ["2-to-1", "4-to-1", "8-to-1", "1-to-2"], correct: 1, img: "mux4to1.png" },
        { question: "How many select lines does a 4-to-1 multiplexer have?", options: ["1", "2", "3", "4"], correct: 1, img: null },
        { question: "A decoder with 3 inputs has _____ outputs.", options: ["4", "6", "8", "16"], correct: 2, img: null },
        { question: "Identify this circuit:", options: ["ripple counter", "synchronous counter", "Johnson counter", "ring counter"], correct: 0, img: "ripplecounter.png" },
        { question: "The phenomenon of accumulated delay in ripple counters is called?", options: ["setup time", "propagation delay", "hold time", "clock skew"], correct: 1, img: null },
        { question: "A D flip-flop stores:", options: ["one bit", "two bits", "four bits", "byte"], correct: 0, img: null },
        { question: "Which flip-flop has a toggle mode when J=K=1?", options: ["SR", "JK", "D", "T"], correct: 1, img: null },
        { question: "This is the symbol for a _____ flip-flop.", options: ["SR", "JK", "D", "T"], correct: 2, img: "dff.png" },
        { question: "The Boolean expression for 2-input XOR is:", options: ["A·B + A'·B'", "(A+B)'", "A'·B + A·B'", "A·B"], correct: 2, img: null },
        { question: "A 3-input NAND gate output is 0 only when:", options: ["all inputs 1", "all inputs 0", "at least one 1", "odd number of 1s"], correct: 0, img: null }
    ];

    const hardBank = [
        { question: "Which circuit generates a carry lookahead to speed up addition?", options: ["ripple adder", "carry lookahead adder", "serial adder", "half adder"], correct: 1, img: null },
        { question: "Identify this advanced counter type:", options: ["ring counter", "Johnson counter", "ripple counter", "MOD-10 counter"], correct: 1, img: "modcounter.png" },
        { question: "A MOD-16 counter requires how many flip-flops?", options: ["2", "3", "4", "5"], correct: 2, img: null },
        { question: "The number of output lines in a 4-to-16 decoder is:", options: ["4", "8", "16", "32"], correct: 2, img: null },
        { question: "This is an implementation of _____ using NAND gates.", options: ["XOR", "XNOR", "AND", "OR"], correct: 1, img: "xnor3.png" },
        { question: "How many NAND gates are needed to realize a 2-input XOR?", options: ["3", "4", "5", "6"], correct: 2, img: null },
        { question: "The setup time of a flip-flop refers to:", options: ["time before clock edge data must be stable", "time after clock edge data held", "propagation clock to output", "minimum pulse width"], correct: 0, img: null },
        { question: "A sequential circuit's output depends on:", options: ["only current input", "past and present inputs", "only clock", "only previous output"], correct: 1, img: null },
        { question: "Identify this circuit (universal gate implementation):", options: ["NOR as AND", "NAND as OR", "NOR as OR", "NAND as XOR"], correct: 0, img: "nor5.png" },
        { question: "A 16-to-1 multiplexer requires how many select lines?", options: ["2", "3", "4", "5"], correct: 3, img: null },
        { question: "The Boolean expression Y = (A⊕B)' represents:", options: ["AND", "OR", "XNOR", "NOR"], correct: 2, img: null },
        { question: "This figure shows a _____ using NOR gates.", options: ["SR latch", "clocked D latch", "master-slave FF", "T flip-flop"], correct: 0, img: "nor4.png" },
        { question: "Which adder has the fastest carry propagation?", options: ["ripple carry", "carry lookahead", "carry select", "serial"], correct: 1, img: null },
        { question: "How many full adders are needed for a 4-bit ripple adder?", options: ["2", "3", "4", "8"], correct: 2, img: null },
        { question: "The propagation delay in a 4-bit ripple adder is mainly due to:", options: ["sum logic", "carry chain", "clock", "power supply"], correct: 1, img: null }
    ];

    // PICK QUESTIONS
    function pickRandomQuestions(bank, count = 8) {
        if (bank.length <= count) return bank.slice();
        const shuffled = [...bank];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }

    // STATE MANAGER
    class QuizController {
        constructor() {
            this.currentDifficulty = '';
            this.questions = [];
            this.currentIndex = 0;
            this.score = 0;
            this.selectedOptionIdx = null;
            this.answerSubmitted = false;
            this.totalQuestions = 8;

            this.mainMenu = document.getElementById('mainMenu');
            this.quizContainer = document.getElementById('quizContainer');
            this.quizArea = document.getElementById('quizArea');
            this.navigationRow = document.getElementById('navigationRow');
            this.scoreDisplay = document.getElementById('scoreDisplay');
            this.qCount = document.getElementById('qCount');
            this.backBtn = document.getElementById('backToMenuBtn');

            this.startQuiz = this.startQuiz.bind(this);
            this.render = this.render.bind(this);
            this.updateHeader = this.updateHeader.bind(this);
            this.goToMenu = this.goToMenu.bind(this);
        }

        startQuiz(difficulty) {
            this.currentDifficulty = difficulty;
            let bank;
            if (difficulty === 'easy') bank = easyBank;
            else if (difficulty === 'moderate') bank = moderateBank;
            else bank = hardBank;

            this.questions = pickRandomQuestions(bank, 8);
            this.totalQuestions = this.questions.length;
            this.currentIndex = 0;
            this.score = 0;
            this.selectedOptionIdx = null;
            this.answerSubmitted = false;

            this.mainMenu.classList.add('hidden');
            this.quizContainer.classList.remove('hidden');
            this.render();
        }

        render() {
            if (!this.questions.length || this.currentIndex >= this.questions.length) {
                // show result summary
                this.quizArea.innerHTML = `
                    <div class="result-summary">
                        <h2 class="heading-secondary">✅ Quiz Completed</h2>
                        <div class="final-score">${this.score} / ${this.totalQuestions}</div>
                        <p class="info-text">Difficulty: ${this.currentDifficulty.toUpperCase()}</p>
                    </div>
                `;
                this.navigationRow.innerHTML = `<button class="quiz-btn" id="restartSameDiff">🔄 Try Again (Same Level)</button>`;
                document.getElementById('restartSameDiff')?.addEventListener('click', () => {
                    this.startQuiz(this.currentDifficulty);
                });
                this.updateHeader();
                return;
            }

            const q = this.questions[this.currentIndex];
            const imgHtml = q.img ? `<img class="circuit-img" src="${baseImgPath}${q.img}" alt="circuit" onerror="this.style.display='none';">` : '';

            let optsHtml = '';
            q.options.forEach((opt, idx) => {
                let btnClass = 'option-btn';
                if (this.answerSubmitted) {
                    if (idx === q.correct) btnClass += ' selected-correct';
                    else if (idx === this.selectedOptionIdx && idx !== q.correct) btnClass += ' selected-wrong';
                }
                optsHtml += `<div class="${btnClass}" data-opt-index="${idx}">${opt}</div>`;
            });

            const feedback = this.answerSubmitted ?
                (this.selectedOptionIdx === q.correct ? '<span style="color: green;">✅ Correct!</span>' : `<span style="color: red;">❌ Wrong. Correct: ${q.options[q.correct]}</span>`) : '';

            this.quizArea.innerHTML = `
                <div class="question-card">
                    <div class="question-text">${this.currentIndex + 1}. ${q.question}</div>
                    ${imgHtml}
                    <div class="options-grid">${optsHtml}</div>
                    <div class="feedback-msg">${feedback}</div>
                </div>
            `;

            // attach option listeners
            document.querySelectorAll('.option-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (this.answerSubmitted) return;
                    const idx = parseInt(btn.dataset.optIndex, 10);
                    if (isNaN(idx)) return;
                    this.selectedOptionIdx = idx;
                    this.answerSubmitted = true;
                    if (idx === q.correct) this.score += 1;
                    this.render();
                    this.updateHeader();
                });
            });

            // next button if answered
            if (this.answerSubmitted) {
                const nextBtn = document.createElement('button');
                nextBtn.id = 'nextQuestionBtn';
                nextBtn.className = 'quiz-btn';
                nextBtn.textContent = (this.currentIndex === this.totalQuestions - 1) ? '⏩ Finish' : 'Next →';
                this.navigationRow.innerHTML = '';
                this.navigationRow.appendChild(nextBtn);
                document.getElementById('nextQuestionBtn').addEventListener('click', () => {
                    if (this.currentIndex < this.totalQuestions - 1) {
                        this.currentIndex++;
                        this.selectedOptionIdx = null;
                        this.answerSubmitted = false;
                        this.render();
                        this.updateHeader();
                    } else {
                        // move to result
                        this.currentIndex = this.totalQuestions;
                        this.render();
                        this.updateHeader();
                    }
                });
            } else {
                this.navigationRow.innerHTML = '';
            }

            this.updateHeader();
        }

        updateHeader() {
            this.scoreDisplay.textContent = `🏆 ${this.score}`;
            const displayedIndex = Math.min(this.currentIndex, this.totalQuestions);
            this.qCount.textContent = `${displayedIndex} / ${this.totalQuestions}`;
        }

        goToMenu() {
            this.quizContainer.classList.add('hidden');
            this.mainMenu.classList.remove('hidden');
            
            // reset quiz
            this.currentIndex = 0;
            this.score = 0;
            this.questions = [];
        }
    }

    // Initialize Quiz Only if Elements Exist
    if(document.getElementById('mainMenu')) {
        const quiz = new QuizController();

        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const diff = e.target.dataset.diff;
                quiz.startQuiz(diff);
            });
        });

        quiz.backBtn.addEventListener('click', () => {
            quiz.goToMenu();
        });
    }
}
