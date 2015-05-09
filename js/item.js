function Item(x, y, id, value, field) {
    this.x = x;
    this.y = y;
    this.id = "item_" + id;
    this.text = value;
    this.field = field;
    this.init();
}

Item.prototype.init = function() {
    var elem = Item.create({
        tag: "div",
        id: this.id,
        className: "item item-new item_" + this.text +
        " x" + this.x +" y" + this.y,
        value: this.text
    });
    d("container").appendChild(elem);
    this.field.setItemsCell(this.x, this.y, this);
};

Item.prototype.move = function(x, y) {
    this.field.items[this.x][this.y] = false;

    this.x = x;
    this.y = y;

    d(this.id).className = "item item_" + this.text + " x" + x +" y" + y;

    this.field.setItemsCell(x, y, this);
};

Item.prototype.double = function() {
    this.text *= 2;
    d(this.id).className =
        "item item_" + this.text + " x" + this.x + " y" + this.y;
    d(this.id).classList.add("double");
    d(this.id).innerHTML = this.text;
};

Item.prototype.equals = function(other) {
    return this.text == other.text;
};

Item.prototype.remove = function() {
    var self = this;

    d(this.id).classList.add("hidden");
    setTimeout(function() {
        d("container").removeChild(d(self.id));
    }, 400);

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
                this.equals(this.field.items[this.x + kx][this.y + ky])
            )
                return true;

    return false;
};

Item.create = function(paramObject) {
    var element = document.createElement(paramObject.tag);
    element.id = paramObject.id;
    element.className = paramObject.className;
    element.innerHTML = paramObject.value;
    return element;
};