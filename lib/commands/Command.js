/**
 * Command is an abstract class that represents a K3po Command
 * @param type
 * @constructor
 */
function Command(type) {
    this.type = type;
}

Command.prototype.getType = function () {
    return this.type;
};

module.exports = Command;
