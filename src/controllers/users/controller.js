import { authAdmin } from "../../database-connection/database.js";
import { query, collection, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../database-connection/database.js";
import expressAsyncHandler from "express-async-handler";
export const getUsers = async (req, res) => {
    try {
        const listUsers = await authAdmin.listUsers();
        const users = listUsers.users.map(mapUser);
        return res.status(200).send({ users });
    } catch (err) {
        return handleError(res, err);
    }
}

export const createUser = async (req, res) => {
    try {
        const { displayName, password, email, role, gender, image } = req.body;

        if (!displayName || !password || !email || !role ) {
            return res.status(400).send({ message: 'Missing fields' });
        }

        const userRecord = await authAdmin.createUser({
            displayName,
            password,
            email
        });
        await authAdmin.setCustomUserClaims(userRecord.uid, { role });
        //create user on firestore
        await setDoc(doc(db, "users", userRecord.uid), {
            uid: userRecord.uid,
            displayName,
            email,
            role: role,
            // gender: gender,
            // image: image,
        });
        //create empty user chats on firestore
        await setDoc(doc(db, "userChats", userRecord.uid), {});
        return res.status(201).send({ uid: userRecord.uid });
    } catch (err) {
        return handleError(res, err);
    }
}

export const mapUser = (user) => {
    const customClaims = (user.customClaims || { role: '' }) || { role: '' };
    const role = customClaims.role ? customClaims.role : '';
    return {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        role,
        lastSignInTime: user.metadata.lastSignInTime,
        creationTime: user.metadata.creationTime,
    };
}

export const getUserWithId = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await authAdmin.getUser(id);
        return res.status(200).send({ user: mapUser(user) });
    } catch (err) {
        return handleError(res, err);
    }
}
export const getUserWithDisplayName = expressAsyncHandler(async (req, res, next) => {
    const displayName = req.params['displayName']
    const q = query(
        collection(db, "users"),
        where("displayName", "==", displayName)
    );

    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            res.status(200).json({
                status: true,
                data: doc.data()
            })
        });
    } catch (err) {
        console.log(err)
    }
})

export const patch = async (req, res) => {
    try {
        const { id } = req.params;
        const { displayName, password, email, role } = req.body;

        if (!id || !displayName || !password || !email || !role) {
            return res.status(400).send({ message: 'Missing fields' });
        }
        await authAdmin.updateUser(id, {
            displayName,
            password,
            email
        });

        // await authAdmin.updateUser(id, { displayName, password, email });
        await authAdmin.setCustomUserClaims(id, { role });
        const user = await authAdmin.getUser(id);
        await setDoc(doc(db, "users", id), {
            uid: id,
            displayName,
            email,
            role: role,
        });
        return res.status(204).send({ user: mapUser(user) });
    } catch (err) {
        return handleError(res, err);
    }
}

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        await authAdmin.deleteUser(id);
        return res.status(204).send({});
    } catch (err) {
        return handleError(res, err);
    }
}

function handleError(res, err) {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
}


export const getUserWithToken = async (req, res, next) => {
    const q = query(
        collection(db, "users"),
        where("uid", "==", req.user) // token come from authentication middleware
    );
    try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            res.status(200).json({
                status: true,
                data: doc.data()
            })
        });
    } catch (err) {
        console.log(err)
    }
}