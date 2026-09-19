import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import styles from "./CartDrawer.module.css";

function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalPrice,
  } = useCart();

  return (
    <>
      <div
        className={`${styles.overlay} ${
          isCartOpen ? styles.overlayVisible : ""
        }`}
        onClick={closeCart}
      />

      <aside
        className={`${styles.drawer} ${isCartOpen ? styles.drawerOpen : ""}`}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Mi carrito</h2>
          <button className={styles.closeButton} onClick={closeCart}>
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className={styles.empty}>
            <p>🧉 Tu carrito está esperando su primer mate.</p>
            <Link
              to="/productos"
              className={styles.emptyLink}
              onClick={closeCart}
            >
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {cart.map((item) => (
                <div className={styles.item} key={item.id}>
                  <img
                    src={item.img}
                    alt={item.name}
                    className={styles.thumb}
                  />

                  <div className={styles.info}>
                    <p className={styles.name}>{item.name}</p>
                    <div className={styles.quantityRow}>
                      <button
                        className={styles.qtyButton}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className={styles.qtyButton}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className={styles.itemRight}>
                    <p className={styles.itemPrice}>
                      ${(item.price * item.quantity).toLocaleString("es-AR")}
                    </p>
                    <button
                      className={styles.removeButton}
                      onClick={() => removeItem(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.subtotalRow}>
                <span>Subtotal</span>
                <strong>${totalPrice.toLocaleString("es-AR")}</strong>
              </div>
              <Link
                to="/cart"
                className={styles.viewCartButton}
                onClick={closeCart}
              >
                Ir al carrito
              </Link>
              <Link
                to="/checkout"
                className={styles.checkoutButton}
                onClick={closeCart}
              >
                Comprar ahora
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
