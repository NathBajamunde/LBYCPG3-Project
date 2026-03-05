/***********************************************
Change Page Content
***********************************************/
// Global Variable to Denote Target Element for Content Change
const target = document.querySelector(".main-content");

// Function to Change Content to Specified Page
function changeContent(page) { 
    fetch(`./assets/pages/${page}.html`)
        .then(res => {
            // Get Text from Fetched Page if Response is OK
            if (res.ok) {
                return res.text();
            }
        })
        .then(content => {
            // Swap Main Content with the New Page
            target.innerHTML = content;
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
function pageChange(page) {
    changeContent(page);
    setActive(page);
    clearList();
    addToList([0]);
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
    ["", "searchLogicCalculator", "pageChange('logicCalculator'); return false;", "Logic Calculator"],
    ["", "searchTruthTableGenerator", "pageChange('truthTableGenerator'); return false;", "Truth Table Generator"],
    ["", "searchQuiz",          "pageChange('quiz'); return false;", "Quiz"],
    ["", "searchHome",          "pageChange('home'); return false;", "Home"]
];

// Map searchList to each keyword for easier access
const keywordMap = new Map([
    // General Categories & Broad Terms
    ["Gates", [1, 3, 4, 5, 6, 7, 8, 9]], 
    ["Logic", [1, 2, 15]],
    
    // Specific Logic Gates
    ["NOT", [3]], 
    ["AND", [4]],
    ["OR", [5]],
    ["NAND", [6]],
    ["NOR", [7]],
    ["XOR", [8]],
    ["XNOR", [9]],

    // Combinational Logic & Related Circuits
    ["Combinational", [2, 10, 11, 12]], // Added Adders, Mux, Decoders
    ["Adders", [10]],
    ["Multiplexers", [11]],
    ["Decoders", [12]],

    // Sequential Logic & Related Circuits
    ["Sequential", [2, 13, 14]], // Added Flip-Flops and Counters
    ["Flip", [13]],
    ["Flops", [13]],
    ["Counters", [14]],

    // Tools & Utilities
    ["Calculator", [15]],
    ["Truth Table", [16]],
    ["Generator", [16]],

    // Misc
    ["Home", [18]],
    ["Quiz", [17]]
]);

// Search Keywords
const keywords = [
    "Gates", "AND", "OR", "NOT", "NAND", "NOR", "XNOR", "XOR", "Logic", 
    "Combinational", "Sequential", "Adders", "Multiplexers", "Decoders",
    "Flip", "Flops", "Counters", "Calculator", "Truth Table", "Generator",
    "Quiz", "Home"
];

// Remove Currently Exisiting Items from List
function clearList() {
    document.getElementById("searchDropdownList").innerHTML = "";
}

// Function to filter out keywords based on the input text
function searchItems(searchTerm) {
    // Normalize Search Term (Convert to Lowercase, Remove Spaces)
    searchTerm = searchTerm.toLowerCase().replace(/\s+/g, "");

    // Return no keywords if text is empty
    if (searchTerm == "") return [];

    // Filter words that include the search term
    return results = keywords.filter(
        word => word.toLowerCase().replace(/\s+/g, "").includes(searchTerm)
    );
};

// Get the indices for accessing 
function getSearchList(filtKeywords) {
    // Use Set to avoid adding duplicates
    var results = new Set();

    // For every keyword in the result, get searchList indices from keywordMap
    filtKeywords.forEach(element => {
        const idxs = keywordMap.get(element);
        // Extract individual searchList and add to the results set
        idxs.forEach(idx => {
            results.add(idx);
        });
    });

    
    // If results is empty, add the index for "No Results Found"
    if (results.size == 0) {
        results.add(0);
    }
    
    return results;
}

// Add newly searched items to the list
function addToList(idxs) {
    // Declare an Empty String
    var htmlListString = "";

    // Create HTML code for adding list
    idxs.forEach(idx => {
        var newItem = `<li><a class="dropdown-item item-search ${searchList[idx][0]}" href="#" id="${searchList[idx][1]}" onclick="${searchList[idx][2]}">${searchList[idx][3]}</a></li>` 
        htmlListString = htmlListString.concat(newItem)
    });

    // Insert HTML code into the document and add the list
    document.getElementById("searchDropdownList").innerHTML = htmlListString;
}

// Summary Function for updating search list
function updateList() {
    // Clear Current List
    clearList();
    // Get Keywords based on the typed text
    const filteredKeywords = searchItems(document.getElementById("searchInput").value);
    // Get idexes for search item look up table
    const searchListIdx = getSearchList(filteredKeywords);
    // Create new list
    addToList(searchListIdx);
    return searchListIdx;
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
Logic Calculator Functionality
***********************************************/
//Attach Logic Calculation Listeners
function attachLogicCalcListeners() {
    // Listener Variables
    var in1Listener = innerDoc.getElementById("in1");
    var in2Listener = innerDoc.getElementById("in2"); 
    var gatesListener = innerDoc.getElementById("gates");

    // Event Listeners
    in1Listener.addEventListener("change", calculate);
    in2Listener.addEventListener("change", calculate);
    gatesListener.addEventListener("change", calculate);
}

// Logical Evaluation Function
function calculate() {
    // Get Inputs and Parse to Int for Safe Evaluation
    const in1 = parseInt(innerDoc.getElementById("in1").value);
    const in2 = parseInt(innerDoc.getElementById("in2").value);
    const gates = innerDoc.getElementById("gates").value;
    const img = innerDoc.getElementById("gateImg");
    var outputColor = innerDoc.getElementById("output");
    // Initialize Ouput Variable
    var output = 0;

    switch (gates) {
        case "and":
            // Bitwise AND
            output = in1 & in2;
            img.src = "images/and1.png";
            break;
        case "or":
            // Bitwise OR
            output = in1 | in2;
            img.src = "images/or1.png";
            break;
        case "nand":
            // Logical Not + Bitwise & Use Number to convert to 1 or 0
            output = Number(!(in1 & in2));
            img.src = "images/nand1.png";
            break;
            // Logical Not + Bitwise | Use Number to convert to 1 or 0
        case "nor":
            output = Number(!(in1 | in2));
            img.src = "images/nor1.png";
            break;
            // Bitwise XOR
        case "xor":
            output = in1 ^ in2;
            img.src = "images/xor1.png";
            break;
            // Logical Not + Bitwise XOR Use Number to convert to 1 or 0
        case "xnor":
            output = Number(!(in1 ^ in2));
            img.src = "images/xnor1.png";
            break;
        default: 
            output = 0;
    }
    // Change Output Text to New Output
    innerDoc.getElementById("output").innerHTML = "<strong>Output:</strong> " + output;
    
    
    outputColor.classList.remove("highOutput", "lowOutput");
    if (output === 1) {
        outputColor.classList.add("highOutput");
    } 
    else {
        outputColor.classList.add("lowOutput");
    }

}

/***********************************************
Startup Functions (Functions to Call on Load)
***********************************************/
pageChange("home");