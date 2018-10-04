
function split(val){
    return val.split(/,\s*/);
}

function extractLast(term){
    return split(term).pop();
}

function widgetCreateFunction(){
    this._super();
    this.widget().menu("option","items","> :not(.ui-autocomplete-category)");
};

function widgetRenderMenu(ul,items){
    var that = this;
    currentCategory = "";
    $.each( items,function(index,item){
        var li;
        if (item.category !== currentCategory){
            ul.append("<li class = 'ui-autocomplete-category'>"+item.category+"</li>");
            currentCategory = item.category;
        }
        li = that._renderItemData(ul,item);
        if(item.category){
            li.attr("aria-label",item.category+" : "+item.label);
        }
    })
};    

function widgetRenderItem(ul, item){
    terms = this.term.split(',');
    term = terms[terms.length - 1].trim();
    var r = new RegExp(term, 'g');
    var blueChar = item.value.replace(r, "<span class='match-character'>" + term + "</span>");
    var bondChar = "<span class='bond-character'>" + blueChar + "</span>";
    return $("<li></li>").append(bondChar).appendTo(ul);
};

function onKeyDownFunction(event){
    if( (event.keyCode === $.ui.keyCode.TAB 
        || event.keyCode === $.ui.keyCode.ENTER) 
        && $(this).autocomplete("instance").menu.active ){
      event.preventDefault();   // do not do default action
    }
};

function autocompleteSourceFunction(request,response){
      response($.ui.autocomplete.filter( data,extractLast(request.term)));
};

function autocompleteSelectFunction(even,ui){
    var terms = split(this.value);
    terms.pop();
    terms.push(ui.item.value);
    terms.push("");
    this.value = terms.join(", ");
    return false;
}

$.widget("custom.autocomplete", $.ui.autocomplete, {
    _create: widgetCreateFunction,
    _renderMenu: widgetRenderMenu,
    _renderItem: widgetRenderItem
});
   
var data = [
        {label:"anders", category:""},
        {label:"andreas",category:""},
        {label:"antal",category:""},
        {label:"annhhx10",category:"products"},
        {label:"annk K12",category:"products"},
        {label:"annttop C13",category:"products"},
        {label:"andres  andersson",category:"people"},
        {label:"andreas  andersson",category:"people"},
        {label:"andreas  johnson",category:"people"}
    ];

$(function(){
    $("#search")
    .bind("keydown", onKeyDownFunction)
    .autocomplete({
        minLength: 0,
        source: autocompleteSourceFunction,
        focus: function(){
            return false;
        },
        select: autocompleteSelectFunction
        });
});