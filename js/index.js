var items = new Array(4);
var notOpen = new Array(4);

var won = false;

var count = 0,
	score = 0,
	successMoving = false;

function Item(x, y, id, value) {
	this.x = x;
	this.y = y;
	this.id = "item_" + id;
	this.v = value
	this.init();
}

Item.prototype.init = function() {
	var elem = document.createElement("div");
	elem.className = "item item-new item_" + this.v + " x" + this.x +" y" + this.y;
	elem.id = this.id;
	elem.innerHTML = this.v;
	document.getElementById("container").appendChild(elem);

	items[this.x][this.y] = this;
};

Item.prototype.reinit = function() {
	var elem = document.getElementById(this.id);
	var container = document.getElementById("container");
	container.removeChild(elem);
	elem = document.createElement("div");
	elem.id = this.id
	elem.className = "item item_" + this.v + " x" + this.x +" y" + this.y + " double";
	elem.innerHTML = this.v;

	container.appendChild(elem);

	items[this.x][this.y] = this;
};

Item.prototype.move = function(x, y) {
	items[this.x][this.y] = false;

	this.x = x; 
	this.y = y;

	document.getElementById(this.id).className = "item item_" + this.v + " x" + x +" y" + y;

	items[x][y] = this;
};

Item.prototype.equals = function(other) {
	return this.v == other.v;
};

Item.prototype.remove = function() {
	document.getElementById("container").removeChild(document.getElementById(this.id));

	delete this;
};

Item.prototype.hasAnyEqualNeighbors = function() {
	for (var kx = -1; kx < 2; ++kx)
		for (var ky = -1; ky < 2; ++ky)
			if (this.x + kx >= 0 &&
				this.x + kx < 4 &&
				this.y + ky >= 0 &&
				this.y + ky < 4 &&
				!( kx == ky || kx == -ky ) &&
				this.equals(items[this.x + kx][this.y + ky])
			)
				return true;

	return false;
};

window.onload = function() {
	for (var i = 0; i < 4; ++i) {
		items[i] = new Array(4);
		notOpen[i] = new Array(4);
		for (var j = 0; j < 4; ++j) {
			items[i][j] = false;
			notOpen[i][j] = false;
		}
	}

	generateNewItem();
	generateNewItem();
};

keys = {
	left: 37,
	up: 38,
	right: 39,
	down: 40
}

function unclose() {
	for (var i = 0; i < 4; ++i) {
		for (var j = 0; j < 4; ++j) {
			notOpen[i][j] = false;
		}
	}
}

window.onkeydown = function(e) {

	switch (e.keyCode) {
		case keys.left:
			for (var x = 0; x < 4; ++x)
				for (var y = 0; y < 4; ++y)
					if (items[x][y] != false)
						doMove(-1, 0, x, y);

			break;

		case keys.right:
			for (var x = 3; x >= 0; --x)
				for (var y = 3; y >= 0; --y)
					if (items[x][y] != false)
						doMove(1, 0, x, y);
			break;

		case keys.up:
			for (var y = 0; y < 4; ++y)
				for (var x = 0; x < 4; ++x)
					if (items[x][y] != false)
						doMove(0, -1, x, y);
			break;

		case keys.down:
			for (var y = 3; y >= 0; --y)
				for (var x = 3; x >= 0; --x)
					if (items[x][y] != false)
						doMove(0, 1, x, y);
			break;
	}
	if (e.keyCode == keys.left || e.keyCode == keys.right || e.keyCode == keys.up || e.keyCode == keys.down) {
		if (successMoving) {
			setTimeout(function() {
				generateNewItem();
			}, 300);
			successMoving = false;
		}

		unclose();

		if (!won && goodScore())
			win();

		if (allIsBusy() && !ableForNew())
			gameOver();
	}
}

function doMove(kx, ky, x, y) {
	var x0 = x, y0 = y;
	var item = items[x][y],
		temp,
		eq = false;

	if (kx != 0) {
		while ( (x > 0 && kx == -1) || (x < 3 && kx == 1) ) {
			if (!items[x+kx][y]) {
				x += kx;
				successMoving = true;
			}
			else if ( item.equals(items[x + kx][y]) && !notOpen[x + kx][y] ) {
				eq = true;
				x += kx;
				temp = items[x][y];
				notOpen[x][y] = true;
				break;
			}
			else break;
		}
	}
	else if (ky != 0) {
		while ( (y > 0 && ky == -1) || (y < 3 && ky == 1) ) {
			if (!items[x][y+ky]) {
				y += ky;
				successMoving = true;
			}
			else if ( item.equals(items[x][y + ky]) && !notOpen[x][y + ky] ) {
				eq = true;
				y += ky;
				temp = items[x][y];
				notOpen[x][y] = true;
				break;
			}
			else break;
		}
	}
	item.move(x, y);

	if (eq) {
		item.v *= 2;
		var v = item.v;

		score += v;
		document.getElementById("score").innerHTML = score;

		setTimeout(function() {
			temp.remove();
			item.reinit();
		}, 200);

		successMoving = true;
	}
}

function generateNewItem() {
	if (allIsBusy())
		return;
	var x, y;
	do {
		x = Math.floor(Math.random() * 4);
		y = Math.floor(Math.random() * 4);
	} while (items[x][y] != false)

	var v = (Math.random() < 0.8) ? 2 : 4;

	new Item(x, y, count++, v);
}

function allIsBusy() {
	for (var i = 0; i < 4; ++i)
		for (var j = 0; j < 4; ++j)
			if (items[i][j] == false)
				return false;
	return true;
}

function gameOver() {
	alert("Game Over");
}

function goodScore() {
	for (var i = 0; i < 4; ++i) {
		for (var j = 0; j < 4; ++j) {
			if (items[i][j] && items[i][j].v >= 2048) {
				won = true;
				return true;
			}
		}
	}
	return false;
}

function win() {
	alert("You win!");
}

function ableForNew() {
	for (var i = 0; i < 4; ++i)
		for (var j = 0; j < 4; ++j)
			if (items[i][j] != false && items[i][j].hasAnyEqualNeighbors())
				return true;
	return false;
}