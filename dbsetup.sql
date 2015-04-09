CREATE TABLE Item (
item_id VARCHAR(32) PRIMARY KEY,
title VARCHAR(128) NOT NULL,
category VARCHAR(64) NOT NULL,
genre VARCHAR(64) NOT NULL,
device VARCHAR(64) NOT NULL,
release_date DATE NOT NULL,
price NUMBER(*, 2) NOT NULL CHECK(price>=0),
rent_price NUMBER(*, 2) NOT NULL CHECK(rent_price>=0)
);

CREATE TABLE Accounts (
email VARCHAR(64) PRIMARY KEY,
username VARCHAR(64) NOT NULL,
password VARCHAR(64) NOT NULL,
admin CHAR(1) NOT NULL CHECK(admin='Y' OR admin='N')
);

CREATE TABLE Purchase (
customer VARCHAR(64) REFERENCES Accounts(email) ON DELETE CASCADE,
item VARCHAR(32) REFERENCES Item(item_id) ON DELETE CASCADE,
purchase_date DATE NOT NULL,
PRIMARY KEY (customer, item)
);

CREATE TABLE Rent (
customer VARCHAR(64) REFERENCES Accounts(email) ON DELETE CASCADE,
item VARCHAR(32) REFERENCES Item(item_id) ON DELETE CASCADE,
borrow_date DATE NOT NULL,
due_date DATE NOT NULL,
return_date DATE,
PRIMARY KEY(customer, item, borrow_date),
CHECK(borrow_date<=due_date),
CHECK(return_date IS NULL OR borrow_date<=return_date)
);

CREATE TABLE Likes (
customer VARCHAR(64) REFERENCES Accounts(email) ON DELETE CASCADE,
item VARCHAR(32) REFERENCES Item(item_id) ON DELETE CASCADE,
PRIMARY KEY (customer, item)
);

CREATE TRIGGER update_email AFTER UPDATE OF email ON Accounts
FOR EACH ROW
BEGIN
UPDATE Purchase SET customer=:NEW.email WHERE customer=:OLD.email;
UPDATE Rent SET customer=:NEW.email WHERE customer=:OLD.email;
UPDATE Likes SET customer=:NEW.email WHERE customer=:OLD.email;
END;
/

CREATE TRIGGER update_itemid AFTER UPDATE OF item_id ON Item
FOR EACH ROW
BEGIN
UPDATE Purchase SET item=:NEW.item_id WHERE item=:OLD.item_id;
UPDATE Rent SET item=:NEW.item_id WHERE item=:OLD.item_id;
UPDATE Likes SET item=:NEW.item_id WHERE item=:OLD.item_id;
END;
/

