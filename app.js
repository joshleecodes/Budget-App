var budgetModule = (function() {
    
    
})();



var UIModule = (function() {
    
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        btnInput: '.add__btn'
    };
    
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
            };
        },
        
        getDOMStrings: function() {
            return DOMStrings;
        }
    };
    
})();



var controller = (function(budgetMod, UIMod) {
    
    var setupEventListeners = function() {
        var DOM = UIModule.getDOMStrings();
        
        document.querySelector(DOM.btnInput).addEventListener('click', ctrlAddItem);
    
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
               ctrlAddItem();
            }
        });
    }
    
    var ctrlAddItem = function() {
        
        //Get input data
        var input = UIModule.getInput();
        console.log(input);
        
        //Add item to buget controller 
        //Add item to user interface
        //Calculate new budget
        //Display buget in UI
    }
    
    return {
        init function() {
            console.log('App Started');
            setupEventListeners();
        }
    }
    
})(budgetModule, UIModule);