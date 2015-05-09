Array.prototype.repeat = function(value, count) {
	var valueIsArray = false;
	if (value instanceof Array)
		valueIsArray = true;
	while (count) {
		if (valueIsArray) value = [].slice.call(value);
		this[--count] = value;
	}
	return this;
};
Object.prototype.contains = function(obj) {
    for (var i in this)
        if (this[i] === obj)
            return true;
    return false;
}
function d(id) {
	return document.getElementById(id);
}

function win() {
	alert("win");
}

function gameOver() {
	alert("Game Over");
}
