/******************************************************************************
********************************** CITATIONS **********************************
*******************************************************************************

We used and adapted the starter code found in the explorations for the setup,
general layout, and most API calls/ functions of this file. Google Gemini AI was
also used to help troubleshoot the DELETE function.

  Link: https://canvas.oregonstate.edu/courses/1999601/pages/
    exploration-implementing-cud-operations-in-your-app?module_item_id=25352968

  The code in the above link was used and adapted for our API calls/ route handlers.

  Link: https://canvas.oregonstate.edu/courses/1999601/pages/
    exploration-web-application-technology-2?module_item_id=25352948

  The code in the above link was used and adapted for our API calls/ route handlers,
  and setup of the handlebars.

*****************************************************************************/


require('dotenv').config();
const express = require('express');
const exphbs = require('express-handlebars');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 9080;

// Set up Handlebars
app.engine('.hbs', exphbs.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


// Database connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Routes

// RESET DATABASE route
app.get('/reset-database', async (req, res) => {
    try {
        const connection = await db.getConnection();
        await connection.query("CALL ResetDatabase()");
        connection.release();
        console.log("Database reset successfully");
        res.redirect('/'); // Redirect to home after reset
    } catch (err) {
        console.error("Error resetting database:", err);
        res.status(500).send("Error resetting database");
    }
});

// DELETE Property route
app.post('/properties/delete/:id', async (req, res) => {
    try {
        await db.query("CALL DeleteProperty(?)", [req.params.id]);
        console.log(`Property ${req.params.id} deleted`);
        res.redirect('/properties');
    } catch (err) {
        console.error("Error deleting property:", err);
        res.status(500).send("Error deleting property");
    }
});

// DELETE Buyer route
app.post('/buyers/delete/:id', async (req, res) => {
    try {
        await db.query("CALL DeleteBuyer(?)", [req.params.id]);
        console.log(`Buyer ${req.params.id} deleted`);
        res.redirect('/buyers');
    } catch (err) {
        console.error("Error deleting buyer:", err);
        res.status(500).send("Error deleting buyer");
    }
});

// DELETE Seller route
app.post('/sellers/delete/:id', async (req, res) => {
    try {
        await db.query("CALL DeleteSeller(?)", [req.params.id]);
        console.log(`Seller ${req.params.id} deleted`);
        res.redirect('/sellers');
    } catch (err) {
        console.error("Error deleting seller:", err);
        res.status(500).send("Error deleting seller");
    }
});

// DELETE Agent route
app.post('/agents/delete/:id', async (req, res) => {
    try {
        await db.query("CALL DeleteAgent(?)", [req.params.id]);
        console.log(`Agent ${req.params.id} deleted`);
        res.redirect('/agents');
    } catch (err) {
        console.error("Error deleting agent:", err);
        res.status(500).send("Error deleting agent");
    }
});

// DELETE Transaction route
app.post('/transactions/delete/:id', async (req, res) => {
    try {
        await db.query("CALL DeleteTransaction(?)", [req.params.id]);
        console.log(`Transaction ${req.params.id} deleted`);
        res.redirect('/transactions');
    } catch (err) {
        console.error("Error deleting transaction:", err);
        res.status(500).send("Error deleting transaction");
    }
});











// Home Page 
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Minds of Moria Real Estate',
    pages: [
      {name: 'Properties', url: '/properties', description: 'Property Records'},
      {name: 'Buyers', url: '/buyers', description: 'Buyer Account Records'},
      {name: 'Sellers', url: '/sellers', description: 'Seller Account Records'},
      {name: 'Agents', url: '/agents', description: 'Real Estate Agent Account Records'},
      {name: 'Transactions', url: '/transactions', description: 'Transaction Records'}
    ]
  });
});

// ***** Properties Routes ***** //

// Show all properties
app.get('/properties', async (req, res) => {
  try {
    const [properties] = await db.query(`
      SELECT p.*, s.name as sellerName 
      FROM Properties p
      JOIN Sellers s ON p.sellerID = s.sellerID
      ORDER BY p.propertyID ASC
    `);
    const [sellers] = await db.query(`
    SELECT  name FROM Sellers
    `);
    
    console.log('Properties retrieved:', properties.length);
    console.log('First property:', properties[0]);

    res.render('properties', {
      title: 'Property Listings',
      properties: properties,
      sellers: sellers
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Show single Property

// Make new Property
app.post('/properties', async (req, res) => {
  try {
    const { sellerID, address, price, sqft, typeProperty, description } = req.body;
    await db.query(`
    INSERT INTO Properties
    (sellerID, address, price, sqft, typeProperty, description)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [sellerID, address, price, sqft, typeProperty, description]);

    res.redirect('properties');
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Update a Property

// Delete a Property



// ***** Buyers Routes ***** //

// Show all Buyers
app.get('/buyers', async (req, res) => {
  try {
    const [buyers] = await db.query(`
      SELECT * FROM Buyers
      ORDER BY buyerID ASC
      `);

    console.log('Buyers retrieved:', buyers.length);
    console.log('First buyer:', buyers[0]);

    res.render('buyers', {
      title: 'Buyer Accounts',
      buyers: buyers
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Show single Buyer

// Make new Buyer

// Update a Buyer

// Delete a Buyer


// ***** Sellers Routes ***** //

// Show all Sellers
app.get('/sellers', async (req, res) => {
  try {
    const [sellers] = await db.query(`
      SELECT * FROM Sellers
      ORDER BY sellerID ASC
    `);

    console.log('Sellers retrieved:', sellers.length);
    console.log('First seller:', sellers[0]);

    res.render('sellers', {
      title: 'Seller Accounts',
      sellers: sellers
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Show single Seller

// Make new Seller

// Update a Seller

// Delete a Seller



// ***** Agents Routes ***** //

// Show all agents
app.get('/agents', async (req, res) => {
  try {
    const [agents] = await db.query(`
      SELECT * FROM Agents
      ORDER BY agentID ASC
    `);
    console.log('Agents retrieved:', agents.length);
    console.log('First agent:', agents[0]);

    res.render('agents', {
      title: 'Agent Accounts',
      agents: agents
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

// Show single Agent

// Make new Agent

// Update an Agent

// Delete an Agent



// ***** Transactions Routes ***** //

// Show all transactions
app.get('/transactions', async (req, res) => {
  try {
    const [transactions] = await db.query(`
      SELECT t.transactionID, t.salePrice,
        DATE_FORMAT(t.transactionDate, '%m-%d-%Y') as transactionDate, 
        t.propertyID, p.address, b.name as buyerName,
        s.name as sellerName, ba.name as buyerAgentName,
        sa.name as sellerAgentName
      FROM Transactions t
      JOIN Properties p ON t.propertyID = p.propertyID
      JOIN Buyers b ON t.buyerID = b.buyerID
      JOIN Sellers s ON p.sellerID = s.sellerID
      JOIN Agents ba ON t.buyerAgentID = ba.agentID
      JOIN Agents sa ON t.sellerAgentID = sa.agentID
      ORDER BY t.transactionID ASC
    `);

    console.log('Transactions retrieved:', transactions.length);
    console.log('First transaction:', transactions[0]);

    res.render('transactions', {
      title: 'Transactions',
      transactions: transactions
    });
  } catch (err) {
      console.error(err);
      res.status(500).send('Database error');
    }
});

// Show single Transaction

// Make new Transaction

// Update a Transaction

// Delete a Transaction




// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
