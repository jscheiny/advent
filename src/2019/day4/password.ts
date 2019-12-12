function isValidPassword(password: number) {
    const digits = String(password)
        .split("")
        .map(x => parseInt(x, 10));

    const adjacentDiffs = digits.slice(1).map((value, index) => value - digits[index]);

    if (adjacentDiffs.some(diff => diff < 0)) {
        return false;
    }

    if (adjacentDiffs.every(diff => diff !== 0)) {
        return false;
    }

    const encoding = rle(digits);
    return encoding.some(({ count }) => count == 2);
}

interface Sequence {
    value: number;
    count: number;
}

function rle(digits: number[]) {
    const encoding: Sequence[] = [];
    let currentSequence: Sequence = {
        value: digits[0],
        count: 1,
    };

    for (let index = 1; index < digits.length; index++) {
        const value = digits[index];
        if (value !== currentSequence.value) {
            encoding.push(currentSequence);
            currentSequence = {
                value,
                count: 1,
            };
        } else {
            currentSequence.count++;
        }
    }

    encoding.push(currentSequence);
    return encoding;
}

let count = 0;
for (let test = 278384; test <= 824795; test++) {
    if (isValidPassword(test)) {
        count++;
    }
}

console.log(count);

// let temp = [1, 2, 2, 2, 3, 3, 1];
// console.log(rle(temp));
