/***********************************************
Change Page Content
***********************************************/
// Global Variable to Denote Document
const target = document.querySelector(".main-content");

const changeContent = page => {
    fetch(`./assets/pages/${page}`)
        .then(res => {
            if (res.ok) {
                return res.text();
            }
        })
        .then(content => {
            target.innerHTML = content;
    });
};

/***********************************************
Search Functionality
***********************************************/
// Listener Variable
var srchListen = document.getElementById("searchInput");

// Event Listener
srchListen.addEventListener("keydown", function(event) {
    // If Enter on Keyboard is Pressed
    if (event.key === "Enter") {
        // Prevent Default Event Action
        event.preventDefault();
        // Call Search Function
        search();
    }
});

function search() {
    // Get Text (Add Regex based search w/ Dropdown)
    const text = document.getElementById("searchInput").value;

    
}

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