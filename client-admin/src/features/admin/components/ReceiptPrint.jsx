import "../styles/receipt.css";

const ReceiptPrint = ({ selectedTable }) => {

    if(!selectedTable){

        return null;

    }

    const currentDate =
        new Date().toLocaleDateString();

    const currentHour =
        new Date().toLocaleTimeString();

    const subtotal =
        (selectedTable.total || 0) - 61;

    return (

        <div
            className="receipt-paper"
            id="receipt-print"
        >

            {/* HEADER */}

            <div className="receipt-top">

                <div>

                    <h1>
                        AUREA
                    </h1>

                    <p>
                        Restaurant Manager
                    </p>

                    <span>
                        "La excelencia también se sirve en la mesa."
                    </span>

                </div>

<div className="receipt-logo">
    <img
        src="/logo-ticket.png"
        alt="Aurea"
        className="receipt-logo"
    />

    <div>

        <h1>AUREA</h1>

        <p>Restaurant Manager</p>

    </div>

</div>

            </div>

            {/* BUSINESS */}

            <div className="receipt-business">

                <p>
                    Aurea Restaurant S.A.
                </p>

                <p>
                    Zona 10, Ciudad de Guatemala
                </p>

                <p>
                    NIT: 548921-8
                </p>

                <p>
                    +502 5555-1234
                </p>

            </div>

            {/* TITLE */}

            <div className="receipt-title">

                FACTURA / RECIBO

            </div>

            {/* INFO */}

            <div className="receipt-info">

                <div>

                    <span>
                        Fecha
                    </span>

                    <strong>
                        {currentDate}
                    </strong>

                </div>

                <div>

                    <span>
                        Hora
                    </span>

                    <strong>
                        {currentHour}
                    </strong>

                </div>

                <div>

                    <span>
                        Mesa
                    </span>

                    <strong>
                        {selectedTable.id}
                    </strong>

                </div>

                <div>

                    <span>
                        Cliente
                    </span>

                    <strong>
                        Consumidor Final
                    </strong>

                </div>

            </div>

            {/* PRODUCTS */}

            <table className="receipt-table">

                <thead>

                    <tr>

                        <th>
                            Producto
                        </th>

                        <th>
                            Cant.
                        </th>

                        <th>
                            Total
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        selectedTable?.order?.map((product,index) => (

                            <tr key={index}>

                                <td>
                                    {product.name}
                                </td>

                                <td>
                                    x{product.quantity}
                                </td>

                                <td>
                                    Q{product.price}
                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

            {/* TOTAL */}

            <div className="receipt-summary">

                <div>

                    <span>
                        Subtotal
                    </span>

                    <strong>
                        Q{subtotal}
                    </strong>

                </div>

                <div>

                    <span>
                        IVA
                    </span>

                    <strong>
                        Q61
                    </strong>

                </div>

                <div className="receipt-total">

                    <span>
                        TOTAL
                    </span>

                    <strong>
                        Q{selectedTable.total}
                    </strong>

                </div>

            </div>

            {/* PAYMENT */}

            <div className="receipt-payment">

                <div>

                    <span>
                        Método:
                    </span>

                    <strong>
                        Tarjeta
                    </strong>

                </div>

                <div>

                    <span>
                        Referencia:
                    </span>

                    <strong>
                        #AUR-{selectedTable.id}26
                    </strong>

                </div>

                <div>

                    <span>
                        Mesero:
                    </span>

                    <strong>
                        Juan Pérez
                    </strong>

                </div>

            </div>

            {/* FOOTER */}

            <div className="receipt-footer">

                <p>
                    Gracias por elegir Aurea.
                </p>

                <small>
                    Este documento sirve como comprobante oficial de pago.
                </small>

            </div>

        </div>

    );

};

export default ReceiptPrint;