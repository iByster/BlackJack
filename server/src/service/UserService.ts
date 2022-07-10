import { IUser } from "../types";

class UserService {
    setUserConnectGameStatusActive(userConnected: IUser[], userIds: number[]) {
        for (let i = 0; i < userIds.length; ++i) {
            userConnected.forEach(us => {
                if (us.id === userIds[i]) {
                    us.gameActive = true;
                }
            })
        }

        return userConnected;
    }

    setUserConnectGameStatusDisconnected(userConnected: IUser[], userIds: number[]) {
        for (let i = 0; i < userIds.length; ++i) {
            userConnected.forEach(us => {
                if (us.id === userIds[i]) {
                    us.gameActive = false;
                }
            })
        }

        return userConnected;
    }

    findUserById(id: number, userConnected: IUser[]) {
        return userConnected.find(user => user.id === id);
    }


}

export default UserService;