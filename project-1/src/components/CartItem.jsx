import { currencyFormatter } from "../util/formatting";

export default function CartItem({quantity, price, name, onAdd, onRemove }) {
    return <li className='cart-item'>
            <p>{name} - {quantity} * {currencyFormatter.format(price)}</p>
            <p className="cart-item-actions">
            <button onClick={ onRemove }>-</button>
            <span>{currencyFormatter.format(price)}</span>
            <button onClick={ onAdd }>+</button>
            </p>
        </li>
}