const { Router } = require('express');
const router = Router();
const BD = require('../config/configbd');

//READ
router.get('/getSegurosCoberturas', async (req, res) => {
    sql = "SELECT s.ID_SEGURO, s.NOMBRE_SEGURO, s.DESCRIPCION AS DESCRIPCIONSEGURO, s.PRECIO, s.MONEDA, s.DURACION, c.ID_COBERTURA, C.NOMBRE_COBERTURA, c.DESCRIPCION FROM Seguros s INNER JOIN Coberturas c ON c.ID_Cobertura = s.ID_COBERTURA";

    let result = await BD.Open(sql, [], false);
    DataFEP = [];
    
    result.rows.map(data => {
        let FirstEndPoint = {
            "id_seguro": data[0],
            "nombre_seguro": data[1],
            "descripcion_seguro": data[2],
            "precio_seguro": data[3],
            "moneda_seguro": data[4],
            "duracion_seguro": data[5],
            "id_cobertura": data[6],
            "nombre_cobertura": data[7],
            "descripcion_cobertura": data[8]
        }

        DataFEP.push(FirstEndPoint);
    })

    res.json(DataFEP);
})

router.get('/getSeguroCliente/:idseguro', async (req, res) => {
    const { idseguro } = req.params;
    sql = "SELECT  s.ID_SEGURO, s.NOMBRE_SEGURO, s.DESCRIPCION, s.PRECIO, s.MONEDA, s.DURACION, c.ID_CLIENTE, c.NOMBRE_CLIENTE, c.DIRECCION, c.CORREO_ELECTRONICO,  c.NUMERO_TELEFONO, c.FECHA_NACIMIENTO, c.SEXO  FROM Polizas p INNER JOIN Seguros s ON s.ID_SEGURO = p.ID_SEGURO INNER JOIN Clientes c ON c.ID_CLIENTE = p.ID_CLIENTE WHERE s.ID_SEGURO = :idseguro AND p.ESTADO_POLIZA = 'Activo' ";
    let result = await BD.Open(sql, [idseguro], false);
    DataSEP = [];
    result.rows.map(data => {
        let SecondEndPoint = {
            "id_seguro": data[0],
            "nombre_seguro": data[1],
            "descripcion_seguro": data[2],
            "precio_seguro": data[3],
            "moneda_seguro": data[4],
            "duracion_seguro": data[5],
            "id_cobertura": data[6],
            "nombre_cobertura": data[7],
            "descripcion_cobertura": data[8]
        }
        DataSEP.push(SecondEndPoint);
    })
    res.json(DataSEP);
})


//CREATE

router.post('/addCliente', async (req, res) => {
    const { ID_Cliente,  Nombre_Cliente, Direccion, Correo_Electronico, Numero_Telefono, Fecha_Nacimiento, Sexo } = req.body;

    //sql = "   insert into person(username,firstname,lastname) values (:username,:firstname,:lastname)";
    sql = "INSERT INTO Clientes (ID_Cliente, Nombre_Cliente, Direccion, Correo_Electronico, Numero_Telefono, Fecha_Nacimiento, Sexo) VALUES (:ID_Cliente, :Nombre_Cliente, :Direccion, :Correo_Electronico, :Numero_Telefono,  TO_DATE(:Fecha_Nacimiento,'YYYY-MM-DD'), :Sexo)";

    await BD.Open(sql, [ID_Cliente,  Nombre_Cliente, Direccion, Correo_Electronico, Numero_Telefono, Fecha_Nacimiento, Sexo], true);

    res.status(200).json({
        "ID_Cliente": ID_Cliente,
        "Nombre_Cliente": Nombre_Cliente,
        "Direccion": Direccion,
        "Correo_Electronico": Correo_Electronico,
        "Numero_Telefono": Numero_Telefono,
        "Fecha_Nacimiento": Fecha_Nacimiento,
        "Sexo": Sexo
    })
})

router.post('/addPoliza', async (req, res) => {
    const { ID_Poliza,  ID_Cliente, ID_Seguro, Fecha_Inicio, Fecha_Vencimiento, Estado_Poliza } = req.body;

    //sql = "   insert into person(username,firstname,lastname) values (:username,:firstname,:lastname)";
    sql = "INSERT INTO Polizas (ID_Poliza, ID_Cliente, ID_Seguro, Fecha_Inicio, Fecha_Vencimiento, Estado_Poliza)VALUES (:ID_Poliza, :ID_Cliente, :ID_Seguro, TO_DATE(:Fecha_Inicio,'YYYY-MM-DD'), TO_DATE(:Fecha_Vencimiento,'YYYY-MM-DD'), :Estado_Poliza)";

    await BD.Open(sql, [ID_Poliza,  ID_Cliente, ID_Seguro, Fecha_Inicio, Fecha_Vencimiento, Estado_Poliza], true);

    res.status(200).json({
        "ID_Poliza": ID_Poliza,
        "ID_Cliente": ID_Cliente,
        "ID_Seguro": ID_Seguro,
        "Fecha_Inicio": Fecha_Inicio,
        "Fecha_Vencimiento": Fecha_Vencimiento,
        "Estado_Poliza": Estado_Poliza
    })
})

router.post('/addPago', async (req, res) => {
    const { ID_Pago, ID_Poliza, Fecha_Pago, Total_Pago, Moneda, ID_Detalle_Pago, Metodo_Pago } = req.body;

    //sql = "   insert into person(username,firstname,lastname) values (:username,:firstname,:lastname)";
    sql = "INSERT INTO Pagos (ID_Pago, ID_Poliza, Fecha_Pago, Total_Pago, Moneda) VALUES (:ID_Pago, :ID_Poliza, TO_DATE(:Fecha_Pago,'YYYY-MM-DD'), :Total_Pago, :Moneda)";
    sql1 = "INSERT INTO DetallePagos (ID_Detalle_Pago, ID_Pago, Monto_Pago_Detalle, Metodo_Pago, Moneda) VALUES (:ID_Detalle_Pago, :ID_Pago, :Total_Pago, :Metodo_Pago, :Moneda)";

    await BD.Open(sql, [ID_Pago, ID_Poliza, Fecha_Pago, Total_Pago, Moneda], true);
    await BD.Open(sql1, [ID_Detalle_Pago,  ID_Pago, Total_Pago, Metodo_Pago, Moneda], true);

    res.status(200).json({
        "ID_Pago": ID_Pago,
        "ID_Poliza": ID_Poliza,
        "Fecha_Pago": Fecha_Pago,
        "Total_Pago": Total_Pago,
        "Moneda": Moneda
    })
})

module.exports = router;