INSERT INTO users (Email, Username, PasswordHash, CreatedAt, UpdatedAt) VALUES
('rapolas@mail.com', 'rapvis', 'testpassword', NOW(), NOW()),
('john@mail.com', 'john123', 'pass123', NOW(), NOW()),
('emma@mail.com', 'emma_dev', 'devpass456', NOW(), NOW()),
('liam@mail.com', 'liamx', 'liam789', NOW(), NOW()),
('sofia@mail.com', 'sofia99', 'sofiaSecure', NOW(), NOW()),
('alex@mail.com', 'alexpro', 'alexPass321', NOW(), NOW());

INSERT INTO photos (
UserId,
OriginalFilename,
StoredFilename,
FilePath,
FileSizeBytes,
MimeType,
Status,
UploadedAt,
CreatedAt,
UpdatedAt
)
VALUES
(1, 'sunset.jpg', 'sunset_1.jpg', '/uploads/sunset_1.jpg', 120000, 'image/jpeg', 1, NOW(), NOW(), NOW()),
(2, 'mountain.jpg', 'mountain_1.jpg', '/uploads/mountain_1.jpg', 150000, 'image/jpeg', 1, NOW(), NOW(), NOW()),
(3, 'ocean.jpg', 'ocean_1.jpg', '/uploads/ocean_1.jpg', 98000, 'image/jpeg', 1, NOW(), NOW(), NOW()),
(4, 'forest.jpg', 'forest_1.jpg', '/uploads/forest_1.jpg', 110000, 'image/jpeg', 1, NOW(), NOW(), NOW()),
(5, 'city.jpg', 'city_1.jpg', '/uploads/city_1.jpg', 130000, 'image/jpeg', 1, NOW(), NOW(), NOW());

INSERT INTO puzzles (
PhotoId,
UserId,
Difficulty,
PieceCount,
Status,
CreatedAt,
UpdatedAt
)
VALUES
(1, 1, 1, 50, 1, NOW(), NOW()),
(2, 2, 2, 100, 1, NOW(), NOW()),
(3, 3, 3, 200, 1, NOW(), NOW()),
(4, 4, 2, 150, 1, NOW(), NOW()),
(5, 5, 1, 25, 1, NOW(), NOW());