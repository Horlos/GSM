function PageMode(mode) {
    if (mode) {
        return "View";
    } else {
        return "Edit";
    }
}

function ViewModeChange() {
    this.scope.editMode = !this.scope.editMode;
}

function LastUrlParam(url) {
    var urlAsArray = url.split('/');
    return urlAsArray[urlAsArray.length - 1];
}

function MvcController(pathName) {
    var urlAsArray = pathName.split('/');
    return urlAsArray[1];
}

function SimpleSearch(params) {
    if (params.length == 0) {
        return '';
    }
    var qs = params.replace('?', '');
    return qs.split('=')[1];
}

function GetDate(input, required) {
    if (!required && input.length == 0) return true;
    var validformat = /^\d{2}\/\d{2}\/\d{4}$/ //Basic check for format validity
    var returnval = '';
    if (validformat.test(input)) {
        var monthfield = input.split("/")[0];
        var dayfield = input.split("/")[1];
        var yearfield = input.split("/")[2];
        var dayobj = new Date(yearfield, monthfield - 1, dayfield);
        if ((dayobj.getMonth() + 1 == monthfield) && (dayobj.getDate() == dayfield) && (dayobj.getFullYear() == yearfield))
            returnval = dayobj;
    }
    return returnval;
}

function ValidDate(input, required) {
    if (!required && input.length == 0) return true;
    var validformat = /^\d{1,2}\/\d{1,2}\/\d{4}$/ //Basic check for format validity
    var returnval = false;
    if (validformat.test(input)) {
        var monthfield = input.split("/")[0];
        var dayfield = input.split("/")[1];
        var yearfield = input.split("/")[2];
        var dayobj = new Date(yearfield, monthfield - 1, dayfield);
        if ((dayobj.getMonth() + 1 == monthfield) && (dayobj.getDate() == dayfield) && (dayobj.getFullYear() == yearfield))
            returnval = true;
    }
    return returnval;
}

function ValidDateRange(startDate, endDate) {
    var startDateObj = GetDate(startDate, true);
    var endDateObj = GetDate(endDate, true);
    if (startDateObj != "" && endDateObj != "") {
        return (startDateObj <= endDateObj);
    }
    return false;
}

function FindAndRemove(array, item) {
    $.each(array, function (index, result) {
        if (result == item) {
            array.splice(index, 1);
        }
    });
};

function AddRange(array, arrayToAdd) {
    $.each(arrayToAdd, function (index, result) {
        array.push(result);
    });
};

function DateToday() {
    var d = new Date();
    return (d.getMonth() + 1)+'/'+d.getDate()+'/'+d.getFullYear();
}

function selectFile() {
    var ctl = $('#ctlFileUpload');
    ctl[0].type = "text";
    ctl[0].type = "file";
    ctl.click();
}

function CreateDateFromSqlData(sqlDateStr) {
    if (typeof sqlDateStr == 'string') {
        var splitDate = sqlDateStr.split(/[-T]/);
        return (splitDate[1] + '/' + splitDate[2] + '/' + splitDate[0]);
    }
    return null;
}

function SearchFor(array, searchProperty, searchVal) {
    var result = null;
    $.each(array, function(index) {
        if (array[index][searchProperty] == searchVal) {
            result = array[index];
        }
    });
    return result;
}

function FindObject(array, searchForObject) {
    var result = -1;
    $.each(array, function (index) {
        if (array[index] == searchForObject) {
            result = index;
        }
    });
    return result;
}

function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function determineTextColor(backgroundColor) {
    var rgbColor = hexToRgb(backgroundColor);
    var a = 1 - (0.299 * rgbColor.r + 0.587 * rgbColor.g + 0.114 * rgbColor.b) / 255;

    if (a < 0.5)
        return '#000000';
    else
        return '#ffffff'; 
}


// check if an element exists in array using a comparer function
// comparer : function(currentElement)
Array.prototype.inArray = function (comparer) {
    for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
    }
    return false;
};

// adds an element to the array if it does not already exist using a comparer 
// function
Array.prototype.pushIfNotExist = function (element, comparer) {
    if (!this.inArray(comparer)) {
        this.push(element);
        return true;
    }
    return false;
};

