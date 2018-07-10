/**
 * gets request value
 * @param req
 * @param valueKey
 * @param isSingle
 * @returns {string}
 */
getReqValue = function (req, valueKey, type) {
    var reqValue = '',
        type = (typeof type == 'undefined') ? 'get' : type;
    type = type !== '' ? type.toLowerCase() : type;

    switch (type) {
        case 'get':
            reqValue = req.params[valueKey] || req.body[valueKey] || req.query[valueKey] || '';
            break;

        case 'post':
            reqValue = req.body[valueKey] || '';
            break;

        case 'delete':
            reqValue = req.params[valueKey] || '';
            break;

        case 'put':
            reqValue = req.body[valueKey] || '';
            break;

        case 'single':
            reqValue = req[valueKey] || '';
            break;
    }
    return reqValue;
}

/**
 * By default behaviour of javascript always return undefined word if variable not exist.
 * This function is required to simply removed that word
 *
 * @param value mix
 *
 * @returns mix
 */
getVal = function(value) {
    if (typeof value !== 'undefined' && value !== 'undefined'
        && value !== 'false' && value !== false
        && typeof value === 'string'
    ) {
        return value.trim();
        
    } else if (value && Array.isArray(value) && value.length > 0) {
        return value;
        
    } else if (typeof value == 'undefined') {
        return '';
        
    } else if (typeof value === 'object') {
        return value ? value : {};
        
    } else {
        return value;
    }
}

/**
 * short cut of console.log
 * improve efficiency for debugging
 * @param content
 */
log = function(content, isDept) {
    if (isDept && typeof isDept !== 'undefined') {
        console.dir(content, {depth: null});
    } else {
        console.log('================================================================');
        console.log(content);
    }
}
/**
 * convert some data into specific type format
 *  - formatType 1 is object
 *  - formatType 2 is integer
 *  - foramtType 3 is float
 * @param input
 * @param formatType
 * @returns {mix|*}
 */
normalize = function(input, formatType) {
    input = getVal(input);
    if (input && formatType && typeof formatType !== 'undefined') {
        var variableType = typeof formatType;
        switch (formatType) {
            // format to object
            case 1 :
                input = toObjectId(input);
                break;
            // integer
            case 2 :
                input = parseInt(input);
                break;
            // float
            case 3 :
                input = parseFloat(input);
                break;
            default :
                break;
        }
    }
    return input;
}

/**
 * convert string to mongoose object id
 *
 * @param content
 * @returns {*}
 */
toObjectId = function(content) {
    if (content == '' || typeof content == 'undefined') {
        return null
        
    } else if (typeof content === 'object') {
        return content;
    }

    var ObjectId = (require('mongoose').Types.ObjectId);
    
    if (/[a-f0-9]{24}/.test(content) && ObjectId.isValid(content)) {
        return new ObjectId(content);
    } else {
        log({
            'Route': 'toObjectId',
            'Message': 'Convert string type to objectId',
            'Error': 'Invalid value for objectId, value should be in [a-f0-9]{24}',
            'Data': {
                content: content
            }
        });
        return null;
    }
};
