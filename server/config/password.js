const generator = require('generate-password');

module.exports.generatePassword = (length) => {
    return generator.generate({
        length,
        numbers: true,
        symbols: true,
    });
}