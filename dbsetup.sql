CREATE TABLE Item (
item_id VARCHAR(32) PRIMARY KEY,
title VARCHAR(128) NOT NULL,
category VARCHAR(64) NOT NULL,
genre VARCHAR(64) NOT NULL,
device VARCHAR(64) NOT NULL,
release_date DATE NOT NULL,
price NUMBER(*, 2) NOT NULL CHECK(price>=0),
rent_price NUMBER(*, 2) NOT NULL CHECK(rent_price>=0),
likes INT DEFAULT 0 NOT NULL
);

CREATE TABLE Accounts (
email VARCHAR(64) PRIMARY KEY,
username VARCHAR(64) NOT NULL,
password VARCHAR(64) NOT NULL,
admin CHAR(1) NOT NULL CHECK(admin='Y' OR admin='N')
);

CREATE TABLE Purchase (
customer VARCHAR(64) REFERENCES Accounts(email),
item VARCHAR(32) REFERENCES Item(item_id),
purchase_date DATE NOT NULL,
PRIMARY KEY (customer, item)
);

CREATE TABLE Rent (
customer VARCHAR(64) REFERENCES Accounts(email),
item VARCHAR(32) REFERENCES Item(item_id),
borrow_date DATE NOT NULL,
due_date DATE NOT NULL,
return_date DATE,
PRIMARY KEY(customer, item, borrow_date),
CHECK(borrow_date<=due_date),
CHECK(return_date IS NULL OR borrow_date<=return_date)
);

CREATE TABLE Likes (
customer VARCHAR(64) REFERENCES Accounts(email),
item VARCHAR(32) REFERENCES Item(item_id),
PRIMARY KEY (customer, item)
);

-- Trigger to update item's overall rating after inserting a new rating
CREATE TRIGGER on_add_like AFTER INSERT ON Likes
FOR EACH ROW
BEGIN
UPDATE Item SET likes = likes+1 WHERE item_id=:NEW.item;
END;
/

CREATE TRIGGER on_remove_like AFTER DELETE ON Likes
FOR EACH ROW
BEGIN
UPDATE Item SET likes = likes-1 WHERE item_id=:OLD.item;
END;
/

CREATE TRIGGER delete_item BEFORE DELETE ON Item
FOR EACH ROW
BEGIN
DELETE FROM Purchase WHERE item=:OLD.item_id;
DELETE FROM Rent where item=:OLD.item_id;
END;
/

CREATE TRIGGER delete_user BEFORE DELETE ON Accounts
FOR EACH ROW
BEGIN
DELETE FROM Likes WHERE customer=:OLD.email;
DELETE FROM Purchase WHERE customer=:OLD.email;
DELETE FROM Rent WHERE customer=:OLD.email;
END;
/

-- Inserting some dummy values to test the triggers.
/*INSERT INTO Accounts VALUES('a@email.com', 'A', 'pwd', 'Y');
INSERT INTO Accounts VALUES('b@email.com', 'B', 'password', 'N');
INSERT INTO Item VALUES('1', 'TunesHolic', 'Game', 'Music', 'iOS', to_date('2013-10-2', 'yyyy-mm-dd'), 0, 0, 0);
INSERT INTO Item VALUES('2', 'Brave Frontier', 'Game', 'RPG', 'Android', to_date('2013-7-3', 'yyyy-mm-dd'), 0, 0, 0);
INSERT INTO Likes VALUES('a@email.com', '1');
INSERT INTO Likes VALUES('b@email.com', '1');
INSERT INTO Likes VALUES('a@email.com', '2');
DELETE FROM Likes WHERE customer='a@email.com' AND item='1';
DELETE FROM Likes WHERE customer='a@email.com' AND item='2';

-- Inserting  a few dummy values to test integrity constraints and triggers.
-- INSERT INTO Item VALUES ('1', 'Brave Frontier', 'Game', 'RPG', 'Android', to_date('2013-1-1', 'yyyy-mm-dd'), 0, 0, 0);
-- INSERT INTO Item VALUES ('2', 'The Hobbit: An Unexpected Journey', 'Movie', 'Fantasy', 'DVD', to_date('2012-12-15', 'yyyy-mm-dd'), 30, 13, 0);
-- INSERT INTO Accounts VALUES('zx@email.com', 'zixian', 'password', 'Y');
-- INSERT INTO Purchase VALUES ('zx@email.com', '1', to_date('2014-4-10', 'yyyy-mm-dd'));
-- INSERT INTO Rent VALUES ('zx@email.com', '2', to_date('2014-12-15', 'yyyy-mm-dd'), to_date('2014-12-29', 'yyyy-mm-dd'), NULL);
-- INSERT INTO Rating VALUES ('zx@email.com', '1', 4);
*/
