var budgetModule = (function() {
    //Input constructors for income and expense
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
    
    //Calculates total income or expense based on type
    var calcTotal = function(type) {
        var sum = 0;
        //Loop through array and add each element to sum
        data.allItems[type].forEach(function(current) {
           sum = sum + current.value; 
        });
        //Store current sum in data
        data.totals[type] = sum;
    }
    
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
        },
        //Overall Budget & percentage
        budget: 0,
        budgetPercent: -1
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
        
        calculateBudget: function(){ 
            //calc total income and expenses
            calcTotal('exp');
            calcTotal('inc');
            
            //calc the budget
            data.budget = data.totals.inc - data.totals.exp;
            
            //calc % of spent
            if(data.totals.inc > 0) {
                data.budgetPercent = Math.round((data.totals.exp/data.totals.inc) * 100);   
            } else data.budgetPercent = -1;
        },
        
        //returns a buget Object
        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budgetPerc: data.budgetPercent
            }     
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
        btnInput: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        expensePercentLabel: '.budget__expenses--percentage'
    };
    
    return {
        //Return field values from UI
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },
        
        addListItem: function(obj, type) {
            var html, newHtml, element;
            //Creat HTML placeholder String
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            // Replace the placeholder text
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);
            
            //Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
            
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            
            //Stores HTML querySelector for each field in a NodeList
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            
            //Calls slice from the Array contructor prototype and stores it
            fieldsArr = Array.prototype.slice.call(fields);

            //loops through array and sets values to empty
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });
            
            //Sets focus on decription field for easy input
            fieldsArr[0].focus();
        },
        
        displayBudget: function(object) {
            //Sets UI to display budget after a new item is updated.
            document.querySelector(DOMStrings.budgetLabel).textContent = object.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = object.totalInc;
            document.querySelector(DOMStrings.expenseLabel).textContent = object.totalExp;
            
            //If % is viable then display, else display default.
            if(object.budgetPerc > 0){
                document.querySelector(DOMStrings.expensePercentLabel).textContent =  object.budgetPerc + '%';
            } else document.querySelector(DOMStrings.expensePercentLabel).textContent = '---';
        },
        
        //Return DOMstrings so it can be referenced in other modules
        getDOMStrings: function() {
            return DOMStrings;
        }
    };
    
})();



var controller = (function(budgetMod, UIMod) {
    var setupEventListeners = function() {
        //Parse DOM strings from the UI Module
        var DOM = UIModule.getDOMStrings();
        
        //Button Click event listener
        document.querySelector(DOM.btnInput).addEventListener('click', ctrlAddItem);
        //Enter press event listener
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
               ctrlAddItem();
            }
        });
    }
    
    var updateBudget = function() {
        //Calculate new budget
        budgetModule.calculateBudget();
        
        //return budget
        var budget = budgetModule.getBudget();
        
        //Display budget in UI
        UIModule.displayBudget(budget);
    }
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        //Get input data
        input = UIModule.getInput();
        
        //Check if input fields are valid
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //Add item to buget controller 
            newItem = budgetModule.addItem(input.type, input.description, input.value);

            //Add item to user interface
            UIModule.addListItem(newItem, input.type);

            //Clear fields
            UIModule.clearFields();

            //Calculate and update budget
            updateBudget();
        }
    }
    
    return {
        //Set up EventListeners
        init: function() {
            console.log('App Started');
            //Displays reset budget figures
            UIModule.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                budgetPerc: -1
            });
            setupEventListeners();
        }
    }
    
})(budgetModule, UIModule);
controller.init();