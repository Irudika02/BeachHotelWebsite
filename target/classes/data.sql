-- Seed Rooms
INSERT INTO room (name, price, image_path, description) VALUES 
('Ocean View Suite', '250', 'images/suite.png', 'Wake up to panoramic views of the Indian Ocean from your private balcony with premium amenities.'),
('Azure Family Villa', '650', 'images/villa.png', 'Perfect for families, featuring a private pool, two bedrooms and direct beach access.'),
('Honeymoon Cabana', '400', 'images/cabana.png', 'Our most romantic setting, tucked away in the palm grove with an outdoor spa and sunset views.');

-- Seed Menu Items
INSERT INTO menu_item (name, price, category, description, is_spicy, is_veg, image_path) VALUES 
('Live Hopper Station', '12', 'Breakfast Classics', 'Crispy rice flour crepes served with lunu miris and seeni sambol.', false, true, 'images/food.png'),
('Sri Lankan Breakfast Spread', '18', 'Breakfast Classics', 'Milk rice (Kiribath), fish ambul thiyal, and spicy coconut sambol.', true, false, 'images/food.png'),
('Jaffna Lagoon Crab Curry', '35', 'Ocean Bounty', 'Whole crab cooked in moringa leaves and roasted curry powder.', true, false, 'images/food.png'),
('Grilled Garlic Lobster', '45', 'Ocean Bounty', 'Freshly caught lobster grilled with herb butter and tropical salad.', false, false, 'images/food.png');

-- Seed Reviews
INSERT INTO review (author, country, rating, text, is_approved) VALUES 
('Sarah Jenkins', 'United Kingdom', 5, 'The best beach holiday we ever had. The food was incredible, especially the Jaffna crab curry.', true),
('Anura & Dilini', 'Sri Lanka', 5, 'Absolute paradise. The Honeymoon Cabana was so private and beautiful.', true),
('Markus Weber', 'Germany', 5, 'Professional service and stunning views. The infinity pool is out of this world.', true);

-- Seed Gallery
INSERT INTO gallery_image (title, image_path) VALUES 
('Resort Exterior', 'images/hero.png'),
('Luxury Suite', 'images/suite.png'),
('Traditional Food', 'images/food.png');
