import { Router } from "express";
import is from "@sindresorhus/is";
import { loginRequired } from "../middlewares";
import { userService, productService } from "../services";
import bcrypt from "bcrypt";

const profileRouter = Router();

//GET: 사용자 정보 가져오기
profileRouter.get("/myProfile", loginRequired, async function (req, res) {
    const userId = req.currentUserId;
    const user = await userService.getUser(userId);

    res.status(200).json(user);
});

//PATCH : 사용자 정보 변경하기
profileRouter.patch("/edit", loginRequired, async function (req, res, next) {
    try {
        // content-type 을 application/json 로 프론트에서
        // 설정 안 하고 요청하면, body가 비어 있게 됨.
        if (is.emptyObject(req.body)) {
            throw new Error(
                "headers의 Content-Type을 application/json으로 설정해주세요"
            );
        }

        const userId = req.currentUserId;
        const fullName = req.body.fullName;
        const password = req.body.password;
        const address = req.body.address;
        const phoneNumber = req.body.phoneNumber;
        const role = req.role;
        const currentPassword = req.body.currentPassword;

        // currentPassword 없을 시, 진행 불가
        if (!currentPassword) {
            throw new Error("정보를 변경하려면, 현재의 비밀번호가 필요합니다.");
        }

        const userInfoRequired = { userId, currentPassword };
        // 위 데이터가 undefined가 아니라면, 즉, 프론트에서 업데이트를 위해
        // 보내주었다면, 업데이트용 객체에 삽입함.
        const toUpdate = {
            ...(fullName && { fullName }),
            ...(password && { password }),
            ...(address && { address }),
            ...(phoneNumber && { phoneNumber }),
            ...(role && { role }),
        };

        toUpdate.passwordReset = false;

        // 사용자 정보를 업데이트함.

        // 업데이트 이후의 유저 데이터를 프론트에 보내 줌
        const updatedUser = await userService.setUser(
            userInfoRequired,
            toUpdate
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
});
//DELETE : 탈퇴하기

profileRouter.delete("/quit", loginRequired, async function (req, res, next) {
    try {
        //** 현재의 비밀번호가 일치할때 탈퇴 가능하게  */
        const userId = req.currentUserId;
        const password = req.body.password;
        const user = await userService.getUser(userId);
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new Error("비밀번호가 일치하지 않습니다.");
        } else {
            const deletedUser = await userService.deleteUser(userId);
            res.status(200).json(deletedUser);
        }
    } catch (error) {
        next(error);
    }
});

export { profileRouter };
