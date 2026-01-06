export const tokenDateCalculator = (tokenType: "a" | "r"): [number, number, number] => {
    const createdAt = Date.now();
    let expiresAt = 0;
    let expiresIn = 0;
    if (tokenType == "a") {
        expiresAt = createdAt + 1000 * 60 * 15;
        expiresIn = 1000 * 60 * 15
    } else if (tokenType == "r") {
        const expireyDay = 4;
        expiresAt = createdAt + expireyDay * 1000 * 60 * 60 * 24;
        expiresIn = 1000 * 60 * 60 * 24 * 4
    }

    return [createdAt, expiresAt, expiresIn];
}
