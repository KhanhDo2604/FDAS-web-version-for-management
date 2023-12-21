export function generatePassword() {
    let newPassword = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    const length = 10;
    for (let i = 0; i < length; i++) {
        newPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return newPassword
};

export function generateRandomID() {
    return Math.floor(10000000 + Math.random() * 90000000);
}