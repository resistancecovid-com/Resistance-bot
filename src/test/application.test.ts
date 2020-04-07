
test("funny test", () => {
    const list = ["a", "b", "c", "d", "e"];
    const toSend = ["List of all commands:\n", "command".padEnd(10, " "), "\tdescription\n"];
    let numbers = list
        .map(element => `${element.padEnd(10, "*")}\t${element}\n`).join("");
        // .map(elem => toSend.push(elem));
    console.log(numbers);
});
