import { productService, userService } from "../services";

async function cartOrdered(req, res, next) {
    //유저 objectId가져오기
    const userId = req.currentUserId;
    const user = await userService.getUser(userId);

    //prodjct id 가져오기
    const cartData = req.cartData.orderProduct;
    console.log(cartData)
    let orderedProduct = [];
    for (let i = 0; i < cartData.length; i++) {
        let orderData = await productService.getProductById(cartData[i]._id);
        orderedProduct.push(orderData._id);
    }

    const orderInfo = {
        userId: user._id,
        orderProduct: orderedProduct,
    };

    req.orderInfo = orderInfo;
    next();
}

export { cartOrdered };
