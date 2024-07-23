CREATE TABLE blogPosts (    
    BPid INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR (MAX),
    content NVARCHAR(MAX),    
    authorID INT,
    bpCreated DATETIME,    
    bpModified DATETIME,
    FOREIGN KEY (authorID) REFERENCES users(userID));

INSERT INTO blogPosts (title, content, authorID, bpCreated, bpModified)
VALUES ('title 1','This blog post explores the intricate relationship between politics, climate change, and technology, and their collective impact on education in Southeast Asia. It discusses how political decisions, environmental challenges posed by climate change, and advancements in technology shape the educational landscape of the region, affecting accessibility, curriculum development, and infrastructure. The post also examines potential strategies to address these challenges and foster inclusive and sustainable education in the region.', 1, '2024-06-13 08:30:00', '2024-06-13 08:30:00');
INSERT INTO blogPosts (title, content, authorID, bpCreated, bpModified)VALUES ('title 2','In this blog post, we delve into the multifaceted impact of political instability on education in Southeast Asia. From government funding to academic freedom, we examine how political upheavals influence educational policies and practices in the region. Moreover, we explore potential opportunities for innovation and reform amidst these challenges, highlighting the resilience and adaptability of educational institutions and stakeholders.', 2, '2024-06-12 14:45:00', '2024-06-12 15:30:00');
INSERT INTO blogPosts (title, content, authorID, bpCreated, bpModified)
VALUES ('title 3', 'This blog post elucidates the role of technology in transforming education across Southeast Asia. From e-learning platforms to digital literacy initiatives, we analyze the opportunities and challenges associated with technology integration in diverse educational settings. By examining case studies and best practices, we highlight the potential of technology to enhance learning outcomes and bridge educational gaps in the region.', 3, '2024-06-11 11:20:00', '2024-06-11 12:15:00');
INSERT INTO blogPosts (title, content, authorID, bpCreated, bpModified)VALUES ('title 4', 'This blog post delves into the profound impact of climate change on education systems in Southeast Asia. From natural disasters disrupting learning environments to environmental education initiatives fostering sustainability awareness, we explore the intersection of climate crisis and education. By advocating for climate-resilient educational policies and practices, we aim to empower future generations to address environmental challenges and build a more sustainable future.', 4, '2024-06-10 09:00:00', '2024-06-10 09:30:00');
INSERT INTO blogPosts (title, content, authorID, bpCreated, bpModified)
VALUES ('title 5', 'This blog post examines innovative solutions to navigate the complex challenges facing education in Southeast Asia amidst the intersecting forces of politics, climate change, and technology. From community-driven initiatives promoting inclusive education to cross-border collaborations leveraging digital tools, we showcase diverse approaches to address educational disparities and foster resilience in the face of adversity. By fostering a culture of innovation and collaboration, we strive to build a brighter future for education in Southeast Asia.', 5, '2024-06-09 10:00:00', '2024-06-09 11:00:00');

CREATE TABLE users ( 
userID INT PRIMARY KEY, 
username NVARCHAR(255), 
email NVARCHAR(255), 
password NVARCHAR(255), 
role NVARCHAR(10), 
userCreated DATETIME, 
userModified DATETIME 
); 
 
INSERT INTO users (userID, username, email, password, role, userCreated, userModified) 
VALUES  
(1, 'Alexander', 'Alexander51@gmail.com', 'Alex9401', 'Guest', '2024-06-13 5:00:00', '2024-06-13 6:00:00'), 
(2, 'Emily', 'Emily23@gmail.com', 'Em2020', 'Guest', '2024-06-12 10:00:00', '2024-06-12 11:00:00'), 
(3, 'Garcy', 'Garcy49@email.com', 'Password123', 'Admin', '2024-06-11 12:00:00', '2024-06-11 13:00:00'), 
(4, 'Sophia', 'Sophia98@hotmail.com', 'Sophia95', 'Guest', '2024-06-10 14:00:00', '2024-06-10 15:00:00'), 
(5, 'Jackson', 'Jackson71@outlook.com', 'Jack1985', 'Guest', '2024-06-09 16:00:00', '2024-06-09 17:00:00');


CREATE TABLE News ( newsid INT PRIMARY KEY IDENTITY (1,1),
 headline VARCHAR(50) NOT NULL UNIQUE,  content VARCHAR(255) NOT NULL UNIQUE,
 country VARCHAR(100) NOT NULL,);
INSERT INTO News (headline, content, country) VALUES
('Singapore Launches AI-Powered Education Platform', 'Singapore has launched a new AI-powered education platform to enhance student learning outcomes and teacher training.', 'Singapore'),('Indonesia Invests in Climate-Resilient Schools', 'Indonesia has announced a new initiative to build climate-resilient schools, aiming to protect education infrastructure from natural disasters.', 'Indonesia'),
('Malaysia Introduces Digital Literacy Program', 'Malaysia has launched a nationwide digital literacy program to equip students with essential skills for the digital age.', 'Malaysia'),('Thailand Boosts STEM Education with Robotics', 'Thailand is promoting STEM education by introducing robotics and coding classes in schools, aiming to develop a skilled workforce.', 'Thailand'),
('Vietnam Enhances Education with EdTech', 'Vietnam is leveraging education technology to improve access to quality education, especially in rural areas.', 'Vietnam'),('Philippines Fights for Education Reform', 'The Philippines is pushing for education reform, focusing on curriculum development and teacher training to address learning gaps.', 'Philippines'),
('Myanmar Focuses on Inclusive Education', 'Myanmar is working to promote inclusive education, aiming to increase access to education for marginalized communities.', 'Myanmar'),('Laos Invests in Vocational Training', 'Laos is investing in vocational training programs to prepare students for the workforce and address skills gaps.', 'Laos'),
('Cambodia Prioritizes Climate Change Education', 'Cambodia has made climate change education a priority, integrating it into school curricula to raise awareness and promote sustainability.', 'Cambodia'),('Brunei Develops Skills Development Program', 'Brunei has launched a skills development program to prepare students for the future job market, focusing on emerging technologies and innovation.', 'Brunei');