import fs from "fs/promises";

export const generateID = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?`~';

    function generateRandomString(length) {
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    const timestamp = new Date().getTime();
    const randomString = generateRandomString(8);

    return `${timestamp}=|#${randomString}`;
}

// Function to read JSON data from a file
export async function readJsonData(filePath) {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading JSON data:', error);
    }
}