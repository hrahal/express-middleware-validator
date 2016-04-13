var validator = require("jsonschema").Validator,
    v = new validator();

var schema = {
    "type": "object",
    "properties": {
        "q": {
            "type": "object",
            "properties": {
                "all": {
                    "type": "number"
                }
            }
        }
    }
}

var data = {
    "q":{
        "all": 1
    },
    "m": 1
}

var res = v.validate(data, schema);

console.log(res)
