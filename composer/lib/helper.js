function copyProperty(target, source) {
    for (let name in source) {
        if (name[0] == '$' || name == 'timestamp' || name == 'transactionId') continue;
        target[name] = source[name];
    }
}

function formalizeFields(source) {
    for (let i = 0; i < source.length; i++) {
        if (source[i]['$name'] != null) {
            if (source[i]['$array'] == null) {
                let prop = {};
                prop['$name'] = source[i]['$name'];
                prop['$isRequired'] = source[i]['$isRequired'] == true ? source[i]['$isRequired'] : false;
                switch (source[i]['$type']) {
                    case 'number':
                    case 'string':
                    case 'datetime':
                    case 'boolean':
                    case 'enum':
                        prop['$type'] = source[i]['$type'];
                        break;
                    default:
                        prop['$type'] = 'string';
                }
                if (source[i]['$type'] == 'enum') { // TODO need to be validated
                    prop['$enum'] = source[i]['$enum'];
                }
                source[i] = prop;
            } else {
                formalizeFields(source[i]['$array']);
                if (source[i]['$array'].length == 0) {
                    source.splice(i);
                }
            }
        } else {
            source.splice(i);
        }
    }
}

function formalizeData(data, fields) {
    for (let field of fields) {
        if (field['$array'] != null) {
            formalizeData(data[field['$name']], field['$array']);
        } else {
            if (field['$isRequired'] && (data[field['$name']] == null || data[field['$name']].toString().trim() == '')) {
                throw "Vui lòng nhập " + field['$name'];
            }
            switch (field['$type']) {
                case 'number':
                    if (typeof data[field['$name']] != 'number') {
                        throw field['$name'] + " phải là số";
                    }
                    break;
                case 'string':
                    if (typeof data[field['$name']] != 'string') {
                        throw field['$name'] + " phải là chữ";
                    }
                    break;
                case 'date':
                    if (!isDate(data[field['$name']])) {
                        throw field['$name'] + " phải có định dạng ngày tháng";
                    }
                    break;
                case 'boolean':
                    if (typeof data[field['$name']] != 'boolean') {
                        throw field['$name'] + " phải là kiểu boolean";
                    }
                    break;
                case 'enum':
                    let enumArr = field['$enum'].split(";");
                    let check = enumArr.some(x => {
                        return x == data[field['$name']];
                    });
                    if (!check) {
                        throw field["$name"] + " không đúng định dạng";
                    }
                    break;
            }
        }
    }
}

function isNumeric(val) {
    var _val = +val;
    return (val !== val + 1) //infinity check
        && (_val === +val) //Cute coercion check
        && (typeof val !== 'object') //Array/object check
        && (val.replace(/\s/g, '') !== '') //Empty
        && (val.slice(-1) !== '.') //Decimal without Number
}

function isDate(date) {
    // TODO need to be improved
    return (new Date(date) !== "Invalid Date" && !isNaN(new Date(date)));
}

function error(code, object, explain){
    return JSON.stringify({code:code, object: object, explain : explain});
}

function isAdmin(identity){
    identity = identity == null ? getCurrentParticipant().getQualifiedType() : identity;
    return identity == "Admin" ? true : false;
}

function isNetworkAdmin(identity){
    identity = identity == null ? getCurrentParticipant().getFullyQualifiedType() : identity;
    return identity == "org.hyperledger.composer.system.NetworkAdmin" ? true : false;
}