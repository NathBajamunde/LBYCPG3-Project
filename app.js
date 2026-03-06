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
Logic Calculator Functionality
***********************************************/


/***********************************************
Startup Functions (Functions to Call on Load)
***********************************************/
pageChange("home");