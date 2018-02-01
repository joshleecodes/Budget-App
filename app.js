var budgetModule = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    
    //Data Structure
    var data = {
        //All input items of any type
        allItems:{
            exp: [],
            inc: []
        },
        //Total of each item type
        totals:{
            exp: 0,
            inc: 0
        }
    };
    
    return {
        addItem: function(type, desc, val) {
            var newItem, ID = 0;
            
            //Create new Unique ID
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id + 1;
            } 
            
            //Create new item based on type
            if(type === 'exp'){
                newItem = new Expense(ID, desc, val);
            } else newItem = new Income(ID, desc, val);
            
            //Push item to type based array
            data.allItems[type].push(newItem);
            return newItem;
        },
        
        testing: function() {
        console.log(data);
        }
    };
    
})();



var UIModule = (function() {
    //Store DOM Strings into an object which can be referenced
    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        btnInput: '.add__btn'
    };
    
    return {
        //Return field values from UI
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            };
        },
        //Return DOMstrings so it can be referenced in other modules
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
        var input, newItem;
        //Get input data
        input = UIModule.getInput();
        
        //Add item to buget controller 
        newItem = budgetModule.addItem(input.type, input.description, input.value);
        
        //Add item to user interface
        
        //Calculate new budget
        
        //Display buget in UI
    }
    
    return {
        init: function() {
            console.log('App Started');
            setupEventListeners();
        }
    }
    
})(budgetModule, UIModule);
controller.init();