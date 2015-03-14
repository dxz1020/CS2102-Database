CREATE TABLE Item (
item_id VARCHAR(32) PRIMARY KEY,
title VARCHAR(128) NOT NULL,
category VARCHAR(64) NOT NULL,
genre VARCHAR(64) NOT NULL,
device VARCHAR(64) NOT NULL,
release_date DATE NOT NULL,
price NUMBER(*, 2) NOT NULL CHECK(price>=0),
rent_price NUMBER(*, 2) NOT NULL CHECK(rent_price>=0),
rating NUMBER(2, 1) DEFAULT 0 NOT NULL
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

CREATE TABLE Rating (
customer VARCHAR(64) REFERENCES Accounts(email),
item VARCHAR(32) REFERENCES Item(item_id),
rating INT NOT NULL CHECK(rating>0 AND rating<=5),
PRIMARY KEY (customer, item)
);

-- Trigger to update item's overall rating after inserting a new rating
CREATE TRIGGER update_item_rating AFTER INSERT ON Rating
BEGIN
UPDATE Item SET rating = (SELECT AVG(rating) FROM Rating GROUP BY item HAVING Item.item_id=item) WHERE EXISTS (SELECT * FROM Rating WHERE item=Item.item_id);
END;
/

-- Inserting  a few dummy values to test integrity constraints and triggers.
-- INSERT INTO Item VALUES ('1', 'Brave Frontier', 'Game', 'RPG', 'Android', to_date('2013-1-1', 'yyyy-mm-dd'), 0, 0, 0);
-- INSERT INTO Item VALUES ('2', 'The Hobbit: An Unexpected Journey', 'Movie', 'Fantasy', 'DVD', to_date('2012-12-15', 'yyyy-mm-dd'), 30, 13, 0);
-- INSERT INTO Accounts VALUES('zx@email.com', 'zixian', 'password', 'Y');
-- INSERT INTO Purchase VALUES ('zx@email.com', '1', to_date('2014-4-10', 'yyyy-mm-dd'));
-- INSERT INTO Rent VALUES ('zx@email.com', '2', to_date('2014-12-15', 'yyyy-mm-dd'), to_date('2014-12-29', 'yyyy-mm-dd'), NULL);
-- INSERT INTO Rating VALUES ('zx@email.com', '1', 4);
