import { Schema } from 'mongoose';

const UserSchema = new Schema({
    username: String,
    password: String,
    email: String,
    role: String,
});

export default UserSchema;
