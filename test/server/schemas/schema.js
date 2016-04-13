var Rabbit = require('../../../model');

var myData = {
    "q": {
        "type": "object",
        "required": true,
        "properties": {
            "all": {
                "type": "number"
            }
        }
    },
    "m": {
        "type": "string",
        "required": true
    }
}

Rabbit.schema('/users/', "post", { body: myData, query: {} });
