function Transaction(amount, description) {
    this.amount = amount;
    this.description = description || "";
}
serializeTransactions = function(transactions) {
    let data = "";
    transactions.forEach(t => {
        data += t.amount + "|" + t.description.replace(/|/g, "").replace(/;/, "") + ";";
    });
    return btoa(data);
};
deserializeTransactions = function(serializedData) {
    let transactions = [];
    atob(serializedData)
        .split(";")
        .forEach(t => {
            let split = t.split("|");
            transactions.push(new Transaction(split[0], split[1]));
        });
    return transactions;
};