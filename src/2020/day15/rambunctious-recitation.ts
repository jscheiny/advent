function runGame(input: number[]) {
    const lastTurnSeen = new Map<number, number>();
    for (let index = 0; index < input.length - 1; index++) {
        lastTurnSeen.set(input[index], index);
    }

    let lastSpoken = input[input.length - 1];
    let wasFirstSpoken = true;

    for (let turn = input.length; turn < 30000000; turn++) {
        const lastSpokenTurn = lastTurnSeen.get(lastSpoken);
        lastTurnSeen.set(lastSpoken, turn - 1);
        if (wasFirstSpoken || lastSpokenTurn === undefined) {
            lastSpoken = 0;
        } else {
            lastSpoken = turn - lastSpokenTurn - 1;
        }
        wasFirstSpoken = lastTurnSeen.get(lastSpoken) === undefined;
    }
    console.log(lastSpoken);
}

runGame([0, 1, 5, 10, 3, 12, 19]);
