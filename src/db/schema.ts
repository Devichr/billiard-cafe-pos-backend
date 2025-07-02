import { Pool } from 'pg';

export const initializeDatabase = async (db: Pool): Promise<void> => {
  try {
    // Create tables if they don't exist
    
    // Reservations table
    await db.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        table_id VARCHAR(50) NOT NULL,
        customer_name VARCHAR(100) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        status VARCHAR(20) DEFAULT 'reserved',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Menu items table
    await db.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(100) NOT NULL,
        table_number VARCHAR(20),
        total_amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Order items table
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        menu_item_id INTEGER REFERENCES menu_items(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Lights table for ESP32 control
    await db.query(`
      CREATE TABLE IF NOT EXISTS lights (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        status VARCHAR(10) DEFAULT 'off',
        brightness INTEGER DEFAULT 100,
        power_consumption DECIMAL(5,2) DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample data if tables are empty
    await insertSampleData(db);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database schema:', error);
    throw error;
  }
};

const insertSampleData = async (db: Pool): Promise<void> => {
  try {
    // Check if menu items exist
    const menuCheck = await db.query('SELECT COUNT(*) FROM menu_items');
    if (parseInt(menuCheck.rows[0].count) === 0) {
      // Insert sample menu items
      await db.query(`
        INSERT INTO menu_items (name, description, price, category) VALUES
        ('Espresso', 'Strong black coffee', 25000, 'Coffee'),
        ('Cappuccino', 'Coffee with steamed milk foam', 35000, 'Coffee'),
        ('Latte', 'Coffee with steamed milk', 40000, 'Coffee'),
        ('Club Sandwich', 'Triple layer sandwich with chicken', 65000, 'Food'),
        ('French Fries', 'Crispy golden fries', 30000, 'Food'),
        ('Chocolate Cake', 'Rich chocolate layer cake', 45000, 'Dessert'),
        ('Fresh Orange Juice', 'Freshly squeezed orange juice', 25000, 'Beverage'),
        ('Iced Tea', 'Refreshing iced tea', 20000, 'Beverage')
      `);
    }

    // Check if lights exist
    const lightsCheck = await db.query('SELECT COUNT(*) FROM lights');
    if (parseInt(lightsCheck.rows[0].count) === 0) {
      // Insert sample lights
      await db.query(`
        INSERT INTO lights (name, location, status, brightness, power_consumption) VALUES
        ('Table 1 Light', 'Table 1', 'off', 100, 15.5),
        ('Table 2 Light', 'Table 2', 'off', 100, 15.5),
        ('Table 3 Light', 'Table 3', 'off', 100, 15.5),
        ('Table 4 Light', 'Table 4', 'off', 100, 15.5),
        ('Table 5 Light', 'Table 5', 'off', 100, 15.5),
        ('Table 6 Light', 'Table 6', 'off', 100, 15.5),
        ('Table 7 Light', 'Table 7', 'off', 100, 15.5),
        ('Table 8 Light', 'Table 8', 'off', 100, 15.5),
        ('Main Hall Light', 'Main Hall', 'on', 80, 25.0),
        ('Entrance Light', 'Entrance', 'on', 90, 20.0),
        ('Bar Area Light', 'Bar Area', 'on', 75, 18.5),
        ('Emergency Light', 'Emergency Exit', 'on', 100, 12.0)
      `);
    }

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
    throw error;
  }
};

