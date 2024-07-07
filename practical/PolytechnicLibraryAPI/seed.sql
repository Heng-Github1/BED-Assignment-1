CREATE TABLE Users (
    user_id INT PRIMARY KEY IDENTITY,
    username VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('member', 'librarian')) NOT NULL
);

CREATE TABLE Books (
    book_id INT PRIMARY KEY IDENTITY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    availability CHAR(1) CHECK (availability IN ('Y', 'N')) NOT NULL
);

-- Users Table
INSERT INTO Users (username, passwordHash, role)
VALUES 
('john_doe', '$2a$10$EIXeJ2eR8UmpA8D72Fg8CeDF34N5pt0xKN9NcwxD4Fi0sXQk6GPvO', 'member'), -- password: password123
('jane_doe', '$2a$10$Dz7VuF0IN43v9mM4TWkIBeMW6ICxro7r/qft1eHUbDsefbWTH5NT.', 'member'), -- password: securePass
('admin', '$2a$10$7ZdjZL3GVFVlmeC4FxEcVucfn4G7/O3VO2n6R5hNqD0V0qXe3GA/S', 'librarian'); -- password: adminPass

-- Books Table
INSERT INTO Books (title, author, availability)
VALUES 
('To Kill a Mockingbird', 'Harper Lee', 'Y'),
('1984', 'George Orwell', 'N'),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Y'),
('The Catcher in the Rye', 'J.D. Salinger', 'N'),
('Moby-Dick', 'Herman Melville', 'Y');
