lookup.model_Operation = function(data)
{
    var self = this;
    self.id = data.id;
    self.name = data.name;
    self.data = data.data;
    self.time = data.time;

    self.createDate = new Date(self.time);

    if(self.name === 'create')
    {
        lookup.prefill_Operation(self, self.data);
    }
    if(self.name === 'quote' || self.name === 'quote-edit')
    {
        lookup.prefill_Operation(self, self.data.current);
        self.quoted = {};
        lookup.prefill_Operation(self.quoted, self.data.quoted);
    }

    self.ConvertToJs = function()
    {
        var toReturn =
        {
            id: self.id,
            name: self.name,
            data: self.data,
            time: self.time
        };
        return toReturn;
    };

    self.toolBoxVisible = ko.observable(false);
    self.switchToolBoxVisibility = function()
    {
        self.toolBoxVisible(!self.toolBoxVisible());
        return true;
    };

    self.toTupleKey = function()
    {
        var key = {name: self.name, data: self.data};
        var toReturn = JSON.stringify(key);
        return toReturn;
    };
};

lookup.split_color_from_6_hex = function(color_in_6_hex)
{
    var hex_red = '0x' + color_in_6_hex.substring(1, 3);
    var hex_green = '0x' + color_in_6_hex.substring(3, 5);
    var hex_blue = '0x' + color_in_6_hex.substring(5, 7);
    var int_red = parseInt(hex_red, 16);
    var int_green = parseInt(hex_green, 16);
    var int_blue = parseInt(hex_blue, 16);
    var colorWithIntComponents = 
    {
        red: int_red,
        green: int_green,
        blue: int_blue
    };
    return colorWithIntComponents;
};

lookup.form_rgba_string_constant = function(color_with_components, alpha)
{
    var toReturn = 'rgba(' + color_with_components.red + ', ' + color_with_components.green + ', ' + color_with_components.blue + ', ' + alpha +')' ;
    return toReturn;
};

lookup.prefill_Operation = function(self, abc) {

    self.color = abc.color;
    self.text = abc.text;
    if(typeof(abc.color) === 'undefined')
    {
        self.color_border = "#ff12ff";
    }
    else
    {
        var color_with_components = lookup.split_color_from_6_hex(abc.color);

        self.color_border = lookup.form_rgba_string_constant(color_with_components, '0.6')
    }
    var test = abc.text.split(" ");
    self.textSplitted = ko.utils.arrayMap(test, function (item) {
        var toSearch = item
            .replace("\r", " ")
            .replace("\n", " ")
            .replace("\t", " ")
            .toLowerCase()
            .trim();
        
        // if url then do nothing
        if(!toSearch.startsWith("https://"))
        {
            if (
                toSearch.endsWith(",")
                || toSearch.endsWith(".")
                || toSearch.endsWith("?")
                || toSearch.endsWith("!")) 
            {
                toSearch = toSearch.substring(0, toSearch.length - 1);
            }

        }
        
        return {
            word: item,
            wordQuery: toSearch
        };
    }
    );
}
