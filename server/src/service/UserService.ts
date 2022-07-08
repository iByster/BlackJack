import { IUser } from "../types";

class UserService {
    setUserConnectGameStatusActive(userConnected: IUser[], userIds: number[]) {
        for (let i = 0; i < userIds.length; ++i) {
            userConnected[userIds[i]].gameActive = true;
        }

        return userConnected;
    }

    findUserById(id: number, userConnected: IUser[]) {
        return userConnected.find(user => user.id === id);
    }
}

export default UserService;