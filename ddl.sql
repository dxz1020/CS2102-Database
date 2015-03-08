CREATE TABLE Item (
title VARCHAR(128),
category VARCHAR(64)
genre VARCHAR(64),
device VARCHAR(64),
release_date DATE,
item_id VARCHAR(32) PRIMARY KEY, --i think we need a unique id for item because they can be too many duplicates
price NUMBER,
rent_price NUMBER, 
);

CREATE TABLE User (
username VARCHAR(64) PRIMARY KEY,
password VARCHAR(64),
admin CHAR(1)
);

CREATE TABLE Purchase(
purchase_date DATE,
item_id VARCHAR(32))REFERENCES Item(item_id),
username VARCHAR(64) REFERENCES User(username),
PRIMARY KEY (username, item_id)
);

CREATE TABLE Rent(
borrowed_date DATE NOT NULL,
return_date DATE NOT NULL,
due_date DATE NOT NULL,
CHECK(borrowed_date < return_date),
item_id VARCHAR(32))REFERENCES Item(item_id),
username VARCHAR(64) REFERENCES User(username),
PRIMARY KEY(username, item_id) --rent needs one more field as primary key. user can rent twice as long as he return the prev on time
);

CREATE TABLE Rate(
rating INT(1) CHECK (rating<=5),
item_id VARCHAR(32))REFERENCES Item(item_id),
username VARCHAR(64) REFERENCES User(username),
PRIMARY KEY(username, item_id)
)

