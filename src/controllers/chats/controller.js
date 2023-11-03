import { doc, setDoc, onSnapshot } from "firebase/firestore";
import expressAsyncHandler from "express-async-handler";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { db, storage } from "../../database-connection/database.js";
import {
    arrayUnion,
    serverTimestamp,
    Timestamp,
    updateDoc, deleteDoc
} from "firebase/firestore";

export const getUserChats = expressAsyncHandler(async (req, res, next) => {
    const userChatId = req.params.id
    const userChatsListener = onSnapshot(doc(db, "userChats", userChatId), (doc) => {
        res.status(200).json({
            userChats: doc.data()
        })
    });
    // Remove listener when the request is finished
    req.on('close', () => {
        userChatsListener();
    });
})

export const getChats = expressAsyncHandler(async (req, res, next) => {
    const chatId = req.params['id']
    const chatsListener = onSnapshot(doc(db, "chats", chatId), (doc) => {
        doc.data()?.messages ? res.status(200).json({ messages: doc.data()?.messages }) : res.status(200).json({ messageExists: false });
    });
    // Remove listener when the request is finished
    req.on('close', () => {
        chatsListener();
    });
})

export const getLastChatMessage = expressAsyncHandler(async (req, res, next) => {
    const chatId = req.params['id']
    const chatsListener = onSnapshot(doc(db, "chats", chatId), (doc) => {
        const messagesArray = doc.data()?.messages
        const lengthOfMessagesArray = messagesArray.length
        const lastMessage = messagesArray[lengthOfMessagesArray - 1]?.text
        res.status(200).json({ lastChatMessage: lastMessage ? lastMessage : "" })
    });
    // Remove listener when the request is finished
    req.on('close', () => {
        chatsListener();
    });
})

export const removeUserFromChat = expressAsyncHandler(async (req, res, next) => {
    const { chatId, userId } = req.body
    const messageListener = onSnapshot(doc(db, "chats", chatId), async (document) => {
        const messages = document.data().messages
        const newMessages = messages.filter(message => message.senderId !== userId);
        await updateDoc(doc(db, "chats", chatId), { messages: newMessages });
    });
    await deleteDoc(doc(db, "userChats", userId));

    req.on('close', () => {
        messageListener();
    });
    res.status(200).send({
        message: 'A user removed from a chat successfully.',
    });
    // Remove listener when the request is finished


})


export const deleteChatMessage = expressAsyncHandler(async (req, res, next) => {
    const { messageId, chatId } = req.body
    const messageListener = onSnapshot(doc(db, "chats", chatId), async (document) => {
        const messages = document.data().messages
        const newMessages = messages.filter(message => message.id !== messageId);
        await updateDoc(doc(db, "chats", chatId), { messages: newMessages });
    });

    req.on('close', () => {
        messageListener();
    });

    res.status(200).send({
        message: 'Message deleted successfully.',
    });
})

export const addSeenToMessages = expressAsyncHandler(async (req, res, next) => {
    const { chatId } = req.body
    const messageListener = onSnapshot(doc(db, "chats", chatId), async (document) => {
        const messages = document.data().messages
        messages.map(message => {
            message.seenBy.push(message.senderId)
        })
        console.log(messages)
    });

    req.on('close', () => {
        messageListener();
    });

    res.status(200).send({
        message: 'Message deleted successfully.',
    });
})

import multer from "multer"
const storageMulter = multer.memoryStorage();
const upload = multer({ storage: storageMulter });
export const uploadMessageWithImage = [upload.single('img'), expressAsyncHandler(async (req, res, next) => {
    const { currentUserId, chatId, encryptedText, displayName, role } = req.body
    const img = req.file;
    const time = Date.now();
    try {
        const storageRef = ref(storage, `images/${time + img.filename}`);
        const metadata = {
            contentType: req.file.mimetype,
        };

        const snapshot = await uploadBytesResumable(
            storageRef,
            req.file.buffer,
            metadata
        );
        const downloadURL = await getDownloadURL(snapshot.ref);
        if (img.size > 1024 * 1024) {
            throw new Error('The image file is too large.');
        }
        // Update the chat document with the new message.
        await updateDoc(doc(db, "chats", chatId), {
            messages: arrayUnion({
                id: uuid(),
                text: encryptedText,
                senderId: currentUserId,
                date: Timestamp.now(),
                img: downloadURL,
                displayName: displayName,
                role: role,
                seenBy: [],
            }),
        });

        // Send a success response to the client.
        res.status(200).send({
            message: 'Message uploaded successfully.',
        });
    } catch (error) {
        // Send an error response to the client.
        console.log(error)
        res.status(500).send({
            error: error.message,
        });
    }
})]

export const uploadMessage = expressAsyncHandler(async (req, res, next) => {
    const { currentUserId, chatId, encryptedText, displayName, role } = req.body
    try {
        await updateDoc(doc(db, "chats", chatId), {
            messages: arrayUnion({
                id: uuid(),
                text: encryptedText,
                senderId: currentUserId,
                date: Timestamp.now(),
                displayName: displayName,
                role: role,
                seenBy: [],
            }),
        });
        res.status(200).send({
            message: 'Message uploaded successfully.',
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error.message,
        });
    }
})

export const uploadMessageFunction = expressAsyncHandler(async (req, res, next) => {
    const { currentUserId, chatId, encryptedText, userIdList } = req.body
    try {
        await updateDoc(doc(db, "userChats", currentUserId), {
            // [chatId + ".lastMessage"]: {
                // text: encryptedText,
            // },
            [chatId + ".date"]: serverTimestamp(),
        });
        userIdList.map(async (id) => {
            await updateDoc(doc(db, "userChats", id), {
                // [chatId + ".lastMessage"]: {
                    // text: encryptedText,
                // },
                [chatId + ".date"]: serverTimestamp(),
            });
        })

        res.status(200).send({
            message: 'Message uploaded successfully.',
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error.message,
        });
    }
})

export const createChat = expressAsyncHandler(async (req, res, next) => {
    const combinedId = req.body.combinedId;
    try {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        res.status(200).send({
            message: 'Chat created successfully.',
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error.message,
        });
    }
})

export const setUserChat = expressAsyncHandler(async (req, res, next) => {
    const { currentUserId, selectedUsers } = req.body
    try {
        await setDoc(doc(db, "userChats", currentUserId), {})
        selectedUsers.map(async (user) =>
            await setDoc(doc(db, "userChats", user.key), {})
        )
        res.status(200).send({
            message: 'Chat created successfully.',
        });
    } catch (error) {
        console.log(error)
    }


})

export const createUserChat = expressAsyncHandler(async (req, res, next) => {
    const { combinedId, currentUserId, selectedUsers, chatName, userIdList } = req.body
    try {
        await updateDoc(doc(db, "userChats", currentUserId), {
            [combinedId + ".userInfo"]: {
                uid: combinedId,
                displayName: chatName,
                userIdList: userIdList,
            },
            [combinedId + ".date"]: serverTimestamp(),
        })
        selectedUsers.map(async (user) =>
            await updateDoc(doc(db, "userChats", user.key), {
                [combinedId + ".userInfo"]: {
                    uid: combinedId,
                    displayName: chatName,
                    userIdList: userIdList,
                },
                [combinedId + ".date"]: serverTimestamp(),
            })
        )
        res.status(200).send({
            message: 'Chat created successfully.',
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            error: error.message,
        });
    }
})