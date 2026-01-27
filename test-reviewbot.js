function calculateTotal(items) {
    let total = 0;
    for (var i = 0; i < items.length; i++) {
        total += items[i].price * items[i].quantity;
    }
    return total; // Missing semicolon
}
 
// Security issue: Hardcoded password
const API_KEY = "sk-1234567890abcdef";
 
// Performance issue: Inefficient loop
function findUser(users, targetId) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === targetId) {
            return users[i];
        }
    }
}
 
// Code quality issue: Unused variable
const unusedVariable = "this is never used";
 
module.exports = { calculateTotal, findUser };
