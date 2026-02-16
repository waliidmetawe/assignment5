
//=====================================================================


const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'musicana',
    multipleStatements: true 
});

connection.connect((err) => {
    if (err) throw err;
    executeTasks();
});

function executeTasks() {
    const q1 = `
    CREATE TABLE IF NOT EXISTS Suppliers (
        SupplierID INT AUTO_INCREMENT PRIMARY KEY,
        SupplierName TEXT,
        ContactNumber TEXT
    );
    CREATE TABLE IF NOT EXISTS Products (
        ProductID INT AUTO_INCREMENT PRIMARY KEY,
        ProductName VARCHAR(255),
        Price DECIMAL(10, 2),
        StockQuantity INT,
        SupplierID INT,
        FOREIGN KEY (SupplierID) REFERENCES Suppliers(SupplierID)
    );
    CREATE TABLE IF NOT EXISTS Sales (
        SaleID INT AUTO_INCREMENT PRIMARY KEY,
        ProductID INT,
        QuantitySold INT,
        SaleDate DATE,
        FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
    );`;

    connection.query(q1, (err) => {
        if (err) throw err;
        
        connection.query("ALTER TABLE Products ADD Category VARCHAR(100)", () => {
            
            connection.query("ALTER TABLE Products DROP COLUMN Category", () => {
                
                connection.query("ALTER TABLE Suppliers MODIFY COLUMN ContactNumber VARCHAR(15)", () => {
                    
                    connection.query("ALTER TABLE Products MODIFY COLUMN ProductName VARCHAR(255) NOT NULL", () => {
                        
                        const q6 = `
                        INSERT INTO Suppliers (SupplierName, ContactNumber) VALUES ('FreshFoods', '01001234567');
                        INSERT INTO Products (ProductName, Price, StockQuantity, SupplierID) VALUES 
                        ('Milk', 15.00, 50, 1),
                        ('Bread', 10.00, 30, 1),
                        ('Eggs', 20.00, 40, 1);
                        INSERT INTO Sales (ProductID, QuantitySold, SaleDate) VALUES (1, 2, '2025-05-20');`;
                        
                        connection.query(q6, () => {
                            
                            connection.query("UPDATE Products SET Price = 25.00 WHERE ProductName = 'Bread'", () => {
                                
                                connection.query("DELETE FROM Products WHERE ProductName = 'Eggs'", () => {
                                    
                                    connection.query("SELECT ProductID, SUM(QuantitySold) FROM Sales GROUP BY ProductID", (err, res) => {
                                        console.log(res);

                                        connection.query("SELECT * FROM Products ORDER BY StockQuantity DESC LIMIT 1", (err, res) => {
                                            console.log(res);

                                            connection.query("SELECT * FROM Suppliers WHERE SupplierName LIKE 'F%'", (err, res) => {
                                                console.log(res);

                                                connection.query("SELECT * FROM Products WHERE ProductID NOT IN (SELECT ProductID FROM Sales)", (err, res) => {
                                                    console.log(res);

                                                    connection.query("SELECT Sales.SaleID, Products.ProductName, Sales.SaleDate FROM Sales JOIN Products ON Sales.ProductID = Products.ProductID", (err, res) => {
                                                        console.log(res);

                                                        const q14 = "CREATE USER IF NOT EXISTS 'store_manager'@'localhost' IDENTIFIED BY 'manager123'; GRANT SELECT, INSERT, UPDATE ON *.* TO 'store_manager'@'localhost';";
                                                        connection.query(q14, () => {

                                                            connection.query("REVOKE UPDATE ON *.* FROM 'store_manager'@'localhost'", () => {

                                                                connection.query("GRANT DELETE ON musicana.Sales TO 'store_manager'@'localhost'", () => {
                                                                    connection.end();
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}