import { useContext } from "react";
import { currencyFormatter } from "../util/formatting.js";
import Modal from "./UI/Modal.jsx";
import CartContext from "../store/CartContext.jsx";
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import UserProgressContext from "../store/UserProgressContext.jsx";
import useHttp from "../util/useHttp.js";
import ErrorMessage from "./UI/Error.jsx";

const requestConfig = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
};

export default function Checkout() {
    const cartCtx=useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

   const {
    data,
    isLoading : isSending,
    error,
    sendRequest,
    clearData
} = useHttp('http://localhost:3000/orders', requestConfig );

    const cartTotal = cartCtx.items.reduce((total,item) => {
        return total + item.price * item.quantity;
    }, 0 );

    const handleClose= () => {
        userProgressCtx.hideCheckout();
    }

    const handleFinish = () => {
        cartCtx.clearCart();
        clearData();
        userProgressCtx.hideCheckout();
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const costumerData = Object.fromEntries(formData.entries());

        sendRequest(
            JSON.stringify({
                order: {
                  items: cartCtx.items,
                  customer: costumerData
                }
              })
        );
    }

    let actions = (
        <>
        <Button type="button" textOnly onClick={handleClose} >Close</Button>
        <Button>Confirm Order</Button>
        </>
    );

    if (isSending) {
        actions = <span>Sending order data...</span>
    }

    if(data && !error) {
        return <Modal open={userProgressCtx.progress==='checkout'} onClose={handleClose}>
            <h2>Order Submitted</h2>
            <p>Your order has been submitted successfully.</p>
            <div className="modal-actions">
                <Button onClick={handleFinish}>Close</Button>
            </div>
        </Modal>
    }


    return <Modal open={userProgressCtx.progress==='checkout'} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total Amount:{currencyFormatter.format(cartTotal)}</p>
            <Input label="Name" id="name" type="text" />
            <Input label="Street" id="street" type="text" />
            <Input label="Email" id="email" type="email" />
            <div className="control-row">
            <Input label="Postal Code" id="postal-code" type="number" />
            <Input label="City" id="city" type="text" />
            </div>
            {error && <ErrorMessage title="Error" message={error} />}
            <p className="modal-actions">{actions}</p>        
        </form>
    </Modal>
}
