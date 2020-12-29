import bcryptjs from 'bcryptjs';

export class Encrypt {
    static async encryptPassword(password) {
        const salt = await bcryptjs.genSalt(10);
        return await bcryptjs.hash(password, salt);
    }
    static async comparePassword(password, receivePassword) {
        return await bcryptjs.compare(password, receivePassword);
    }
}