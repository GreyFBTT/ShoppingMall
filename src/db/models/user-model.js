import { model } from "mongoose";
import { UserSchema } from "../schemas/user-schema";

const User = model("users", UserSchema);

export class UserModel {
    async findByEmail(email) {
        const user = await User.findOne({ email: email });
        return user;
    }

    async findById(userId) {
        const user = await User.findOne({ _id: userId });
        return user;
    }

    async create(userInfo) {
        const createdNewUser = await User.create(userInfo);
        return createdNewUser;
    }

    async findAll() {
        const users = await User.find({});
        return users;
    }

    async update({ userId, update }) {
        const filter = { _id: userId };
        const option = { returnOriginal: false };

        const updatedUser = await User.findOneAndUpdate(filter, update, option);
        return updatedUser;
    }

    async updateByEmail(email, update) {
        console.log(email);
        console.log(update);
        const filter = { email: email };
        const option = { returnOriginal: false };

        const updatedUser = await User.findOneAndUpdate(filter, update, option);
        return updatedUser;
    }

    async delete(userId) {
        const filter = { _id: userId };
        const option = { returnOriginal: false };

        const deletedUser = await User.findByIdAndDelete(filter, option);

        return deletedUser;
    }
}

const userModel = new UserModel();

export { userModel };
