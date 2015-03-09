CREATE TABLE Item (
title VARCHAR(128) NOT NULL,
category VARCHAR(64) NOT NULL,
genre VARCHAR(64) NOT NULL,
device VARCHAR(64) NOT NULL,
release_date DATE NOT NULL,
item_id VARCHAR(32) PRIMARY KEY, --i think we need a unique id for item because they can be too many duplicates
price NUMBER NOT NULL CHECK(price>=0),
rent_price NUMBER NOT NULL CHECK(rent_price>=0), 
);

CREATE TABLE User (
username VARCHAR(64) PRIMARY KEY,
password VARCHAR(64) NOT NULL,
admin CHAR(1) NOT NULL CHECK(admin='Y' OR admin='N')
);

CREATE TABLE Purchase(
purchase_date DATE NOT NULL,
item_id VARCHAR(32))REFERENCES Item(item_id),
username VARCHAR(64) REFERENCES User(username),
PRIMARY KEY (username, item_id)
);

CREATE TABLE Rent(
borrowed_date DATE NOT NULL,
return_date DATE,
due_date DATE NOT NULL,
CHECK(return_date IS NULL OR borrowed_date < return_date),
CHECK(due_date > borrowed_date),
item_id VARCHAR(32))REFERENCES Item(item_id),
username VARCHAR(64) REFERENCES User(username),
PRIMARY KEY(username, item_id) --rent needs one more field as primary key. user can rent twice as long as he return the prev on time
);

CREATE TABLE Rate(
rating INT(1) NOT NULL CHECK(rating >=0 AND rating<=5),
item_id VARCHAR(32) REFERENCES Item(item_id),
username VARCHAR(64) REFERENCES User(username),
PRIMARY KEY(username, item_id)
)

