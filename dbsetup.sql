CREATE TABLE Item (
item_id VARCHAR(32) PRIMARY KEY,
title VARCHAR(128) NOT NULL,
category VARCHAR(64) NOT NULL,
genre VARCHAR(64) NOT NULL,
device VARCHAR(64) NOT NULL,
release_date DATE NOT NULL,
price DOUBLE(10, 2) NOT NULL CHECK(price>=0),
rent_price DOUBLE(10, 2) NOT NULL CHECK(price>=0),
rating INT NOT NULL DEFAULT 0
);

delimiter //
CREATE TRIGGER item_price_check BEFORE INSERT ON Item
FOR EACH ROW
BEGIN
IF NEW.price<0 THEN
SET NEW.price=0;
END IF;
IF NEW.rent_price<0 THEN
SET NEW.rent_price=0;
END IF;
END;//
delimiter ;

CREATE TABLE User (
email VARCHAR(64) PRIMARY KEY,
username VARCHAR(64) NOT NULL,
password VARCHAR(64) NOT NULL,
admin CHAR(1) NOT NULL CHECK(admin='Y' OR admin='N')
);

delimiter //
CREATE TRIGGER user_adm_check BEFORE INSERT on User
FOR EACH ROW
  BEGIN
    IF NEW.admin!='Y' AND NEW.admin!='N' THEN
      SET NEW.admin='Y';
    END IF;
  END;//
delimiter ;

CREATE TABLE Purchase (
user VARCHAR(64) REFERENCES User(email),
item VARCHAR(32) REFERENCES Item(item_id),
purchase_date DATE NOT NULL,
PRIMARY KEY (user, item)
);

CREATE TABLE Rent (
user VARCHAR(64) REFERENCES User(email),
item VARCHAR(32) REFERENCES Item(item_id),
borrow_date DATE NOT NULL,
due_date DATE NOT NULL CHECK(borrow_date<=due_date),
return_date DATE CHECK(return_date IS NULL OR borrow_date<=return_date),
PRIMARY KEY(user, item, borrow_date)
);

CREATE TABLE Rating (
user VARCHAR(64) REFERENCES User(email),
item VARCHAR(32) REFERENCES Item(item_id),
rating INT NOT NULL CHECK(rating>=0 AND rating<=5),
PRIMARY KEY (user, item)
);

-- Trigger to update item's overall rating after inserting a new rating
delimiter //
CREATE TRIGGER update_item_rating AFTER INSERT ON Rating
FOR EACH ROW
BEGIN
UPDATE Item SET rating = (SELECT AVG(rating) FROM Rating GROUP BY item HAVING Item.item_id=item) WHERE item_id=NEW.item;
END;//
delimiter ;

INSERT INTO Item VALUES ('1', 'Brave Frontier', 'Game', 'RPG', 'Android', '2013-1-1', 0, 0, 0);
INSERT INTO Item VALUES ('2', 'The Hobbit: An Unexpected Journey', 'Movie', 'Fantasy', 'DVD', '2012-12-15', 30, 13, 0);
INSERT INTO User VALUES('zx@email.com', 'zixian', 'password', 'Y');
INSERT INTO Purchase VALUES ('zx@email.com', '1', '2014-4-10');
INSERT INTO Rent VALUES ('zx@email.com', '2', '2014-12-15', '2014-12-29', NULL);
INSERT INTO Rating VALUES ('zx@email.com', '1', 4);
