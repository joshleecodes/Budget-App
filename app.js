var budgetModule = (function() {
    //Expense Constructor
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    }; 
    //calculates expense % of income
    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0){
            this.percentage = Math.round((this.value/totalIncome)*100);
        }   else this.percentage = -1;
    };
    
    //returns expense function
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    
    //Income Contructor
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
        
        deleteItem: function(type, id){
            var ids, index;
            //Loops through data of specified type and stores values in an array
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            //finds index number of id
            index = ids.indexOf(id);
            
            //index will = -1 if id doesnt exist in the array
            if (index !== -1){
                data.allItems[type].splice(index, 1);
            }          
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

        //Loops over all expenses and calculatesPercentages
        calculatePercent: function(){
            
            data.allItems.exp.forEach(function(current){
                current.calcPercentage(data.totals.inc);
            });  
        },
        
        //returns an arary with all updated percentages
        getPercentages: function(){
            var allPercentages = data.allItems.exp.map(function(current){
                return current.getPercentage();
            });
            return allPercentages;
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
        expensePercentLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPerc: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    //Formats items to include +/-, comma separated and to 2 decimal points
    var formatNumber = function(num, type) {
        var int, dec, numSplit;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');
        int = numSplit[0];
        dec = numSplit[1];

        if(int.length > 3) {
            int = int.substr(0,int.length-3) + ',' + int.substr(int.length -3 ,int.length);
        }

        return (type === 'exp' ? '-': '+') + ' ' + int + '.' + dec;
    };
    
    //ForEach method for iterating through a NodeList and calling the callback function on each node
    var nodeListForEach = function(list, callBack) {
        for(var i=0; i<list.length; i++){
            callBack(list[i], i);
        }  
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            //Insert HTML into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            
            
        },
        
        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
            
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
            var type;
            object.budget > 0 ? type = 'inc' : type = 'exp';
            
            //Sets UI to display budget after a new item is updated.
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(object.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(object.totalInc, 'inc');
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(object.totalExp, 'exp');
            
            //If % is viable then display, else display default.
            if(object.budgetPerc > 0){
                document.querySelector(DOMStrings.expensePercentLabel).textContent =  object.budgetPerc + '%';
            } else document.querySelector(DOMStrings.expensePercentLabel).textContent = '---';
        },
        
        displayPercentages: function(percentages) {
            var fields;
            
            //Store all instances of the expense percentages in a NodeList
            fields = document.querySelectorAll(DOMStrings.expensesPerc);
            
            //Update the % in each node
            nodeListForEach(fields, function(current, index){
                //Check % isnt = 0
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                } else current.textContent = '---';
            }); 
        },
        
        displayDate: function(){
            var now, year, month, months;
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        
        changeType: function(){
            var fields = document.querySelectorAll(
                DOMStrings.inputType + ',' + 
                DOMStrings.inputDescription + ',' + 
                DOMStrings.inputValue);
            
            nodeListForEach(fields, function(current){
                current.classList.toggle('red-focus');            
            });
            
            document.querySelector(DOMStrings.btnInput).classList.toggle('red');
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
        var DOM = UIMod.getDOMStrings();
        
        //Button Click event listener
        document.querySelector(DOM.btnInput).addEventListener('click', ctrlAddItem);
        //Enter press event listener
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
               ctrlAddItem();
            }
        });
        //Event Listener in the container for deleting items
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UIMod.changeType);
    };
    
    var updatePercent = function() {
        //calculate %
        budgetMod.calculatePercent();
        
        //read % from buget module
        var percentages = budgetMod.getPercentages();
        
        //update UI with new %
        UIMod.displayPercentages(percentages);
        
    };
    
    var updateBudget = function() {
        //Calculate new budget
        budgetMod.calculateBudget();
        
        //return budget
        var budget = budgetMod.getBudget();
        
        //Display budget in UI
        UIMod.displayBudget(budget);
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        
        //Get input data
        input = UIMod.getInput();
        
        //Check if input fields are valid
        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //Add item to buget controller 
            newItem = budgetMod.addItem(input.type, input.description, input.value);

            //Add item to user interface
            UIMod.addListItem(newItem, input.type);

            //Clear fields
            UIMod.clearFields();

            //Calculate and update budget & percentages
            updateBudget();
            updatePercent();
        }
    };
    
    var ctrlDeleteItem = function(e) {
        var itemID, splitID, ID, type;
        
        //Stores id of click target
        itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
        
        //check if target clicked is to delete an item
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0].substr(0,3);
            ID = parseInt(splitID[1]);
            
            //delete item from data structure 
            budgetMod.deleteItem(type, ID);
            
            //remove item from UI 
            UIMod.deleteListItem(itemID);
            
            //update budget & percentages
            updateBudget();
            updatePercent();
        }
    };
    
    return {
        //Set up EventListeners
        init: function() {
            console.log('App Started');
            //Displays reset budget figures
            UIMod.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                budgetPerc: -1
            });
            setupEventListeners();
            UIMod.displayDate();
        }
    }
    
})(budgetModule, UIModule);
controller.init();