-- ============================================================
--  Smart Library Management System — Dummy / Seed Data
-- ============================================================

USE smart_library_db;

-- -------------------------------------------------------
-- Passwords are BCrypt of "Admin@123" and "Student@123"
-- -------------------------------------------------------
INSERT INTO users (username, email, password, first_name, last_name, phone, address, role, is_active, student_id, department, semester) VALUES
('admin',   'admin@smartlibrary.com',   '$2a$12$hXPtdBFBGk9BFVZE0Xjk7.D1Wh9rR5f5e5e5e5e5e5e5e5e5e5e5e', 'Super',   'Admin',   '9800000001', '123 Library Lane, City',  'ROLE_ADMIN',   1, NULL,      NULL,           NULL),
('librarian','lib@smartlibrary.com',    '$2a$12$hXPtdBFBGk9BFVZE0Xjk7.D1Wh9rR5f5e5e5e5e5e5e5e5e5e5e5e', 'John',    'Doe',     '9800000002', '456 Book Street, City',   'ROLE_ADMIN',   1, NULL,      NULL,           NULL),
('student1', 's1@college.edu',          '$2a$12$Ym7yZVBO/hXPtdBFBGk9BFVZE0Xjk7.D1Wh9rR5f5e5e5e5e5e5e5e', 'Alice',   'Johnson', '9800000101', '10 Campus Road, City',    'ROLE_STUDENT', 1, 'STU001',  'Computer Science', 3),
('student2', 's2@college.edu',          '$2a$12$Ym7yZVBO/hXPtdBFBGk9BFVZE0Xjk7.D1Wh9rR5f5e5e5e5e5e5e5e', 'Bob',     'Smith',   '9800000102', '12 College Ave, City',    'ROLE_STUDENT', 1, 'STU002',  'Mathematics',      2),
('student3', 's3@college.edu',          '$2a$12$Ym7yZVBO/hXPtdBFBGk9BFVZE0Xjk7.D1Wh9rR5f5e5e5e5e5e5e5e', 'Carol',   'Davis',   '9800000103', '14 University Blvd, City','ROLE_STUDENT', 1, 'STU003',  'Physics',          4),
('student4', 's4@college.edu',          '$2a$12$Ym7yZVBO/hXPtdBFBGk9BFVZE0Xjk7.D1Wh9rR5f5e5e5e5e5e5e5e', 'David',   'Wilson',  '9800000104', '18 Main Street, City',    'ROLE_STUDENT', 1, 'STU004',  'Computer Science', 1),
('student5', 's5@college.edu',          '$2a$12$Ym7yZVBO/hXPtdBFBGk9BFVZE0Xjk7.D1Wh9rR5f5e5e5e5e5e5e5e', 'Emma',    'Taylor',  '9800000105', '20 West Road, City',      'ROLE_STUDENT', 0, 'STU005',  'Chemistry',        5);

INSERT INTO books (title, author, isbn, publisher, publish_year, category, description, total_copies, available_copies, price, location, edition, language, pages, status) VALUES
('Introduction to Algorithms',              'Thomas H. Cormen',            '978-0262033848', 'MIT Press',             2022, 'Computer Science', 'Comprehensive introduction to algorithms.',         3, 2, 850.00, 'CS-A1',  '4th', 'English', 1292, 'AVAILABLE'),
('Clean Code',                              'Robert C. Martin',            '978-0132350884', 'Prentice Hall',         2008, 'Computer Science', 'A handbook of agile software craftsmanship.',       2, 1, 650.00, 'CS-A2',  '1st', 'English', 431,  'AVAILABLE'),
('Design Patterns',                         'Gang of Four',                '978-0201633610', 'Addison-Wesley',        1994, 'Computer Science', 'Elements of reusable object-oriented software.',   2, 2, 750.00, 'CS-A3',  '1st', 'English', 395,  'AVAILABLE'),
('The Pragmatic Programmer',                'David Thomas',                '978-0135957059', 'Addison-Wesley',        2019, 'Computer Science', 'Your journey to mastery.',                         2, 2, 700.00, 'CS-A4',  '2nd', 'English', 352,  'AVAILABLE'),
('Calculus: Early Transcendentals',         'James Stewart',               '978-1285741550', 'Cengage Learning',      2015, 'Mathematics',      'Comprehensive calculus textbook.',                  4, 3, 950.00, 'MT-B1',  '8th', 'English', 1368, 'AVAILABLE'),
('Linear Algebra and Its Applications',     'Gilbert Strang',              '978-0030105678', 'Cengage Learning',      2016, 'Mathematics',      'Introductory linear algebra textbook.',             3, 3, 880.00, 'MT-B2',  '5th', 'English', 576,  'AVAILABLE'),
('University Physics',                      'Hugh D. Young',               '978-0321973610', 'Pearson',               2015, 'Physics',          'Comprehensive university physics textbook.',        3, 2, 920.00, 'PH-C1',  '14th','English', 1600, 'AVAILABLE'),
('Principles of Chemistry',                 'Nivaldo J. Tro',              '978-0134066-62-6','Pearson',              2017, 'Chemistry',        'A molecular approach to chemistry.',               2, 2, 870.00, 'CH-D1',  '4th', 'English', 1232, 'AVAILABLE'),
('Artificial Intelligence: A Modern Approach','Stuart Russell',            '978-0136042594', 'Pearson',               2020, 'Computer Science', 'The definitive AI textbook.',                      2, 1, 1100.00,'CS-A5',  '4th', 'English', 1132, 'AVAILABLE'),
('Database System Concepts',                'Abraham Silberschatz',        '978-0078022159', 'McGraw-Hill',           2019, 'Computer Science', 'Foundational database concepts.',                   3, 3, 900.00, 'CS-A6',  '7th', 'English', 904,  'AVAILABLE'),
('Computer Networks',                       'Andrew S. Tanenbaum',         '978-0132126953', 'Pearson',               2010, 'Computer Science', 'Top-down approach to computer networking.',         2, 2, 780.00, 'CS-A7',  '5th', 'English', 960,  'AVAILABLE'),
('Operating System Concepts',               'Abraham Silberschatz',        '978-1118063330', 'Wiley',                 2018, 'Computer Science', 'The "Dinosaur Book" for OS concepts.',              3, 2, 820.00, 'CS-A8',  '9th', 'English', 976,  'AVAILABLE'),
('Discrete Mathematics',                    'Kenneth H. Rosen',            '978-0072899054', 'McGraw-Hill',           2018, 'Mathematics',      'Applications and mathematical reasoning.',          2, 2, 760.00, 'MT-B3',  '8th', 'English', 840,  'AVAILABLE'),
('The Great Gatsby',                        'F. Scott Fitzgerald',         '978-0743273565', 'Scribner',              2004, 'Literature',       'Classic American novel of the Jazz Age.',           3, 3, 350.00, 'LT-E1',  '1st', 'English', 180,  'AVAILABLE'),
('To Kill a Mockingbird',                   'Harper Lee',                  '978-0061935466', 'HarperCollins',         2002, 'Literature',       'Pulitzer Prize winning novel.',                    2, 2, 380.00, 'LT-E2',  '1st', 'English', 336,  'AVAILABLE'),
('A Brief History of Time',                 'Stephen Hawking',             '978-0553380163', 'Bantam Books',          1998, 'Science',          'From the Big Bang to Black Holes.',                 2, 2, 420.00, 'SC-F1',  '1st', 'English', 212,  'AVAILABLE'),
('Sapiens',                                 'Yuval Noah Harari',           '978-0062316097', 'Harper',                2015, 'History',          'A Brief History of Humankind.',                     3, 3, 550.00, 'HI-G1',  '1st', 'English', 443,  'AVAILABLE'),
('Python Crash Course',                     'Eric Matthes',                '978-1718502703', 'No Starch Press',       2023, 'Computer Science', 'Hands-on, project-based introduction to Python.',   2, 2, 620.00, 'CS-A9',  '3rd', 'English', 552,  'AVAILABLE'),
('Java: The Complete Reference',            'Herbert Schildt',             '978-1260440232', 'McGraw-Hill',           2022, 'Computer Science', 'Comprehensive Java programming reference.',          2, 1, 890.00, 'CS-A10', '12th','English', 1248, 'AVAILABLE'),
('Spring Boot in Action',                   'Craig Walls',                 '978-1617292545', 'Manning Publications',  2016, 'Computer Science', 'Rapid Spring application development.',             2, 2, 720.00, 'CS-A11', '1st', 'English', 264,  'AVAILABLE');

-- Transactions (issue + return)
INSERT INTO transactions (user_id, book_id, transaction_type, issue_date, due_date, return_date, fine_amount, fine_paid, remarks, issued_by) VALUES
(3, 1,  'ISSUE', CURDATE()-28, CURDATE()-14, CURDATE()-10, 0.00,  1, 'Returned on time',   1),
(3, 2,  'ISSUE', CURDATE()-20, CURDATE()-6,  NULL,         70.00, 0, 'Currently issued',   1),
(4, 5,  'ISSUE', CURDATE()-30, CURDATE()-16, CURDATE()-15, 5.00,  1, '1 day late',         1),
(4, 6,  'ISSUE', CURDATE()-10, CURDATE()+4,  NULL,         0.00,  0, 'Active issue',       1),
(5, 9,  'ISSUE', CURDATE()-40, CURDATE()-26, CURDATE()-20, 30.00, 0, 'Fine unpaid',        1),
(5, 7,  'ISSUE', CURDATE()-15, CURDATE()-1,  NULL,         5.00,  0, 'Overdue',            1),
(6, 10, 'ISSUE', CURDATE()-5,  CURDATE()+9,  NULL,         0.00,  0, 'Active',             1),
(6, 3,  'ISSUE', CURDATE()-35, CURDATE()-21, CURDATE()-18, 15.00, 1, '3 days late',        1);

-- Reservations
INSERT INTO reservations (user_id, book_id, status, reservation_date, expiry_date) VALUES
(3, 9,  'PENDING',   CURDATE(),     CURDATE()+7),
(4, 12, 'PENDING',   CURDATE()-2,   CURDATE()+5),
(5, 2,  'FULFILLED', CURDATE()-10,  CURDATE()-3),
(6, 1,  'CANCELLED', CURDATE()-15,  CURDATE()-8);
