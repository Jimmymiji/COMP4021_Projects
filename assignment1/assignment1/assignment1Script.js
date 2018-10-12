
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
        {label:"anders_Unclassified", category:""},
        { label:"andreas_Unclassified",category:""},
        { label:"antal_Unclassified",category:""},
        { label: "anders", category: "General" },
        { label: "andreas", category: "General" },
        { label: "antal", category: "General" },
        { label: "barders", category: "General" },
        { label: "bardreas", category: "General" },
        { label: "bartal", category: "General" },
        { label: "annhhx10", category: "Products" },
        { label: "annk K12", category: "Products" },
        { label: "annttop C13", category: "Products" },
        { label: "barnhhx10", category: "Products" },
        { label: "barnk K12", category: "Products" },
        { label: "barnttop C13", category: "Products" },
        { label: "anders andersson", category: "People" },
        { label: "andreas andersson", category: "People" },
        { label: "andreas johnson", category: "People" },
        { label: "barders antal", category: "People" },
        { label: "bardreas antal", category: "People" },
        { label: "bardreas johnson", category: "People" },
        { label: "jazz", category: "Northwest" },
        { label: "nuggets", category: "Northwest" },
        { label: "thunder", category: "Northwest" },
        { label: "timberwolves", category: "Northwest" },
        { label: "clippers", category: "Pacific" },
        { label: "kings", category: "Pacific" },
        { label: "lakers", category: "Pacific" },
        { label: "suns", category: "Pacific" },
        { label: "warriors", category: "Pacific" },
        { label: "grizzlies", category: "Southwest" },
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