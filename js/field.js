'use strict';
var Field = function() {};

Field.prototype.startGame = function() {
	this.initVariables();
	this.initArrays();
	this.initEvents();
	this.initItems();
};

Field.prototype.initVariables = function () {
	this.won = false;
	this.itemsCount = 0;
	this.score = 0;
	this.successMoving = false;
};

Field.prototype.initArrays = function() {
	this.items = [].repeat(
		[].repeat(false, 4), 4
	);
	this.notOpen = [].repeat(
		[].repeat(false, 4), 4
	);
};

Field.prototype.initEvents = function() {
	var self = this;
	window.addEventListener('keydown', function(e) {
		if(e.keyCode == Field.keys.left)
			self.moveLeft();
		else if(e.keyCode == Field.keys.right)
			self.moveRight();
		else if(e.keyCode == Field.keys.up)
			self.moveTop();
		else if(e.keyCode == Field.keys.down)
			self.moveDown();

		if (Field.keys.contains(e.keyCode)) {
			if (self.successMoving) {
				self.generateNewItem();
				self.successMoving = false;
			}

			self.makeAllCellsAbleForMerge();

			if (!self.won && self.goodScore())
				self.endGame(true);

			if (self.isFill() && !self.isAbleForNewCombination())
				self.endGame();
		}
	});
};

Field.prototype.goodScore = function() {
	for (var i = 0; i < 4; ++i) {
		for (var j = 0; j < 4; ++j) {
			if (this.items[i][j] && this.items[i][j].text >= 2048) {
				this.won = true;
				return true;
			}
		}
	}
	return false;
};

Field.prototype.makeAllCellsAbleForMerge = function() {
	for (var i = 0; i < 4; ++i)
		for (var j = 0; j < 4; ++j)
			this.notOpen[i][j] = false;
};

Field.prototype.moveTop = function() {
	for (var y = 0; y < 4; y++)
		for (var x = 0; x < 4; x++)
			if (this.items[x][y] != false)
				this.doMove(0, -1, x, y);
};

Field.prototype.moveDown = function() {
	for (var y = 3; y > -1; y--)
		for (var x = 3; x > -1; x--)
			if (this.items[x][y] != false)
				this.doMove(0, 1, x, y);
};

Field.prototype.moveLeft = function() {
	for (var x = 0; x < 4; x++)
		for (var y = 0; y < 4; y++)
			if (this.items[x][y] != false)
				this.doMove(-1, 0, x, y);
};

Field.prototype.moveRight = function() {
	for (var x = 3; x > -1; x--)
		for (var y = 3; y > -1; y--)
			if (this.items[x][y] != false)
				this.doMove(1, 0, x, y);
};

Field.prototype.initItems = function() {
	this.generateNewItem();
	this.generateNewItem();
};

Field.keys = {
	left: 37,
	up: 38,
	right: 39,
	down: 40
};

Field.prototype.doMove = function(xFactor, yFactor, x, y) {
	var item = this.items[x][y],
		hasEqualsItemsForMerge = false,
		mergeItem = false;

	if (xFactor != 0) {
		while ((x > 0 && xFactor == -1) || (x < 3 && xFactor == 1)) {
			var nextItem = this.items[x + xFactor][y];
			if (!nextItem) {
				x += xFactor;
				this.successMoving = true;
			}
			else if (item.equals(nextItem) && !this.notOpen[x + xFactor][y]) {
				hasEqualsItemsForMerge = true;
				x += xFactor;
				mergeItem = this.items[x][y];
				this.notOpen[x][y] = true;
				break;
			}
			else break;
		}
	}
	else if (yFactor != 0) {
		while ((y > 0 && yFactor == -1) || (y < 3 && yFactor == 1)) {
			var nextItem = this.items[x][y + yFactor];
			if (!nextItem) {
				y += yFactor;
				this.successMoving = true;
			}
			else if ( item.equals(nextItem) && !this.notOpen[x][y + yFactor] ) {
				hasEqualsItemsForMerge = true;
				y += yFactor;
				mergeItem = this.items[x][y];
				this.notOpen[x][y] = true;
				break;
			}
			else break;
		}
	}
	item.move(x, y);

	if (hasEqualsItemsForMerge) {
		mergeItem.remove();
		item.double();

		this.increaseScore(item.text);

		this.successMoving = true;
	}
};

Field.prototype.increaseScore = function(scoreToAdd) {
	this.score += scoreToAdd;
	d("score").innerHTML = this.score;
};

Field.prototype.generateNewItem = function() {
	if (this.isFill())
		return;
	var x, y;
	do {
		x = Math.floor(Math.random() * 4);
		y = Math.floor(Math.random() * 4);
	} while (this.items[x][y] != false);

	var newItemValue = Math.random() < 0.8 ? 2 : 4;

	new Item(x, y, this.itemsCount++, newItemValue, this);
};


Field.prototype.isFill = function() {
	for (var i = 0; i < 4; ++i)
		for (var j = 0; j < 4; ++j)
			if (this.items[i][j] == false)
				return false;
	return true;
};


Field.prototype.isAbleForNewCombination = function() {
	for (var i = 0; i < 4; ++i)
		for (var j = 0; j < 4; ++j)
			if (this.items[i][j] != false && this.items[i][j].hasAnyEqualNeighbors())
				return true;
	return false;
};

Field.prototype.setItemsCell = function(x, y, item) {
	this.items[x][y] = item;
};

Field.prototype.endGame = function(win) {
	if (win) {
		this.won = true;
		var confirmToContinue = confirm("Congratulations! You win. Are you want to continue?");
		if (!confirmToContinue)
			this.restartGame();
	}
	else {
		alert("Game Over");
		this.restartGame();
	}
};

Field.prototype.restartGame = function() {
	this.clearField();
	this.startGame();
};

Field.prototype.clearField = function() {
	var container = d("container"),
		itemsInContainerToDelete = container.querySelectorAll("div.item");
	[].slice.call(itemsInContainerToDelete).forEach(function(e) {
		container.removeChild(e);
	});
};