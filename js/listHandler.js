

var ListHandler = {
    lists: [],//index of lists in localStorage
    list: [],//current loaded list
    loadLists: function(){
        this.lists = JSON.parse(localStorage.getItem('ListHandlerIndex'));
    },
    loadList: function(name){
        this.list = JSON.parse(localStorage.getItem('ListHandler-'+name));
    },
    saveList: function(name){
        var isNew = true;
        if(this.lists == null){
            this.lists = [];
        }
        for(var i = 0; i < this.lists.length; i++){
            if(this.lists[i] == name){
                isNew = false;
            }
        }
        if(isNew){
            this.lists.push(name);
            localStorage.setItem('ListHandlerIndex', JSON.stringify(this.lists));
        }
        console.log('saving '+name);
        localStorage.setItem('ListHandler-'+name, JSON.stringify(this.list));
        
    },
    removeList: function(name){
        var index = this.lists.indexOf(name);
        this.lists.splice(index, 1);
        localStorage.removeItem('ListHandler-'+name);
        localStorage.setItem('ListHandlerIndex', JSON.stringify(this.lists));
    }
}