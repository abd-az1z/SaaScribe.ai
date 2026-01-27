function processData(data) {
    // Security issue: SQL injection vulnerability
    const query = "SELECT * FROM users WHERE id = " + data.userId;
    
    // Performance issue: Blocking synchronous operation
    const result = fs.readFileSync(/large/file.txt);
    
    // Code quality issue: Magic numbers
    if (data.score > 75) {
        return "excellent";
    }
    
    // Security issue: Eval usage
    eval(data.userInput);
    
    return result;
}
 
// Memory leak issue
var cache = {};
function addToCache(key, value) {
    cache[key] = value; // Never clears cache
}
 
module.exports = { processData, addToCache };
