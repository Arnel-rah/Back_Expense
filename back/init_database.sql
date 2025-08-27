-- Script SQL pour créer et initialiser la base de données expense_tracker
-- CREATE DATABASE expense_tracker;
-- Se connecter à la base de données

-- Doc pour les dev front

\c expense_tracker

-- Création de la table users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Création de la table expenses
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    category_id VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('one-time', 'recurring')) DEFAULT 'one-time',
    start_date DATE,
    end_date DATE,
    receipt VARCHAR(255),
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Création de la table incomes
CREATE TABLE IF NOT EXISTS incomes (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    source VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insertion de données de test pour users
-- Utilise les hachages générés avec bcrypt (avec saltRounds = 10)
-- lien bcrypt => https://bcrypt-generator.com/

INSERT INTO users (email, password) VALUES
('test@example.com', 'resultat de hashage de bcrypt'), 
-- => password123 par exemple dans bcrypt na ze tin lisany
('test2@example.com', 'resultat de hashage de bcrypt');
-- => pass123 par exemple dans bcrypt na ze mety @lisany

-- Insertion de données de test pour categories
INSERT INTO categories (name, user_id) VALUES
('Food', 1),
('Travel', 1),
('Entertainment', 2);

-- Insertion de données de test pour expenses
INSERT INTO expenses (amount, date, category_id, description, type, start_date, end_date, receipt, user_id) VALUES
(100.50, '2025-08-21', 'Food', 'Lunch', 'one-time', NULL, NULL, 'receipt1.jpg', 1),
(50.00, '2025-08-01', 'Travel', 'Flight ticket', 'recurring', '2025-08-01', '2025-12-31', 'receipt2.jpg', 1),
(200.75, '2025-08-20', 'Entertainment', 'Movie night', 'one-time', NULL, NULL, NULL, 2);

-- Insertion de données de test pour incomes
INSERT INTO incomes (amount, date, source, description, user_id) VALUES
(5000.00, '2025-08-01', 'Salary', 'Monthly salary', 1),
(3000.00, '2025-08-15', 'Freelance', 'Project payment', 2);

-- Afficher les données pour verification
SELECT * FROM users;
SELECT * FROM categories;
SELECT * FROM expenses;
SELECT * FROM incomes;